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
   * @param {Array} categories the different category values that the spreadsheets should be split
   *                            by.
   * @param {Number} columnToSplitBy the column index that contains the category values to split
   *   by.
   *
   * @returns {Array} an array of CategorySpecificSpreadsheet values, each keyed by the specified
   *                  category.
   * @private
   */
  var _splitSpreadsheetsByCategories = function (masterSheet, categories, columnToSplitBy) {
    _createExportedColumnIfMissing(masterSheet);
    var masterSheetData = new Model.MasterSheet(masterSheet);
    var categorySpecificSpreadsheets = [];

    masterSheetData.allData.forEach(function (currentRow, index) {

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
