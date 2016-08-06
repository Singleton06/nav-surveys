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
   * @returns {CategorySpecificSpreadsheet[]} an array of CategorySpecificSpreadsheet values, each
   *   keyed by the specified category.
   */
  var _splitSpreadsheetsByCategories = function (masterSheet) {
    _createExportedColumnIfMissing(masterSheet);
    var masterSheetData = new Model.MasterSheet(masterSheet);
    var categorySpecificSpreadsheetHeaders = _getCategorySpecificSpreadsheetHeaders(
      masterSheetData.headers);
    var categorySpecificSpreadsheets = [];
    var lastExportedRowIndex = -1;

    masterSheetData.allData.forEach(function (currentRow, currentRowIndex) {
      var currentRowCategory = currentRow[masterSheetData.splittingColumnIndex];
      if (currentRowCategory === '') {
        return;
      }

      if (categorySpecificSpreadsheets[currentRowCategory] === undefined) {
        categorySpecificSpreadsheets[currentRowCategory] =
          new Model.CategorySpecificSpreadsheet(currentRowCategory, masterSheetData.parentFolder,
            categorySpecificSpreadsheetHeaders);
      }

      if (currentRow[masterSheetData.exportedColumnIndex]) {
        categorySpecificSpreadsheets[currentRowCategory].dataToExport.push(
          currentRow.filter(function (element, index) {
            return index !== masterSheetData.exportedColumnIndex;
          }));

        lastExportedRowIndex =
          lastExportedRowIndex < currentRowIndex ? currentRowIndex : lastExportedRowIndex;
      }
    });

    return categorySpecificSpreadsheets;
  };

  /**
   * Takes the headers from the master sheet and pulls out the relveant headers for category
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
   * @param masterSheet the paster sheet to add the exported column to.
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
