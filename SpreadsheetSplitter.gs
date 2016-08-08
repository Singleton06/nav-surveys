var DataProcessing = DataProcessing || {};

/**
 * Utility meant for splitting a single sheet out into separate spreadsheets based on a specific
 * category.
 */
DataProcessing.SpreadsheetSplitter = (function () {

  /**
   * Splits the provided data into separate subsheets based on the specified categories.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} masterSheet the master sheet containing all of the
   *   data that will be split into multiple category specific sheets.  Note that this method will
   *   not change data in the masterSheet, but may add additional columns for tracking purposes.
   *
   * @returns {Model.ProcessedMasterSheet} a processed master sheet containing all of the
   *   information needed to export the data from the master sheet.
   */
  var _splitSpreadsheetsByCategories = function (masterSheet) {
    _createExportedColumnIfMissing(masterSheet);
    var masterSheetData = new Model.MasterSheet(masterSheet);
    Utility.Debugger.debug('All master sheet data to be processed ' + masterSheetData.allData);

    var categorySpecificSpreadsheetHeaders = _getCategorySpecificSpreadsheetHeaders(
      masterSheetData.headers);
    var categorySpecificSpreadsheets = {};
    var allCategoriesForExporting = [];
    var lastExportedRowIndex = -1;

    masterSheetData.allData.forEach(function (currentRow, currentRowIndex) {
      var currentRowCategory = String(currentRow[masterSheetData.splittingColumnIndex]);
      Utility.Debugger.debug(
        'Current Row: ' + currentRow + ' with detected category ' + currentRowCategory);
      if (currentRowCategory === '') {
        return;
      }

      if (!currentRow[masterSheetData.exportedColumnIndex]) {
        if (categorySpecificSpreadsheets[currentRowCategory] === undefined) {
          allCategoriesForExporting.push(currentRowCategory);
          categorySpecificSpreadsheets[currentRowCategory] =
            new Model.CategorySpecificSpreadsheet(currentRowCategory, masterSheetData.parentFolder,
              categorySpecificSpreadsheetHeaders);
        }

        categorySpecificSpreadsheets[currentRowCategory].dataToExport.push(
          currentRow.filter(function (element, index) {
            return index !== masterSheetData.exportedColumnIndex;
          }));

        // we always add 1 to the currentRowIndex because we are starting our range of
        // data by ignoring the headers.
        lastExportedRowIndex = Math.max(lastExportedRowIndex, currentRowIndex + 1);
      }
    });

    return new Model.ProcessedMasterSheet(categorySpecificSpreadsheets, allCategoriesForExporting,
      lastExportedRowIndex);
  };

  /**
   * Takes the headers from the master sheet and pulls out the relevant headers for category
   * specific spreadsheets.
   *
   * @param {Array} masterSheetHeaders the headers that show up in the master.  This array is not
   *   modified.
   * @private
   */
  var _getCategorySpecificSpreadsheetHeaders = function (masterSheetHeaders) {
    return masterSheetHeaders.filter(function (element) {
      return element !== GlobalConfig.exportedColumnKey;
    });
  };

  /**
   * Adds a column to the specified master sheet to track whether or not the item was exported.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} masterSheet the master sheet to add the
   *   exported column to.
   * @private
   */
  var _createExportedColumnIfMissing = function (masterSheet) {
    if (SheetUtility.getColumnIndexByName(masterSheet, GlobalConfig.exportedColumnKey) == -1) {
      SheetUtility.createColumn(masterSheet, GlobalConfig.exportedColumnKey);
    }
  };

  return {
    splitSpreadsheetByCategories: _splitSpreadsheetsByCategories,
  };
})();
