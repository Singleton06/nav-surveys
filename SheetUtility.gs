var SheetUtility = {
  /**
   * Gets the column titles from the specified sheet.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet the sheet to inspect for the column titles.
   * @returns {Array} an array representing the column titles.
   */
  getColumnTitlesAsArray: function (sheet) {
    var values = SheetUtility.getColumnTitlesAsRange(sheet).getValues()[0];
    if (values.length === 1 && values[0] === '') {
      return [];
    }

    return values;
  },

  /**
   * Gets the column titles from the specified sheet.
   *
   * @param {Sheet} sheet the sheet to pull the column titles from.
   * @returns {Range}  The range containing the column headers.
   */
  getColumnTitlesAsRange: function (sheet) {
    // getLastColumn returns a 0 based index, but the getRange methbod is the count of columns
    var lastColumnIndex = sheet.getLastColumn();
    Utility.Debugger.debug('SheetUtility.getColumnTitlesAsArray called, lastColumn value: ' +
                           lastColumnIndex);

    return sheet.getRange(1, 1, 1, lastColumnIndex == 0 ? 1 : lastColumnIndex);
  },

  /**
   * Searches for the specified column name in the given sheet.
   *
   * @param {Sheet} sheet the sheet to check for the specified column name.
   * @param {string} columnName the name of the column to search for.
   * @return {number} the index of the column based on the column name specified within the sheet
   *         specified.  This will be 0-based and will return -1 in situations where the index could
   *         not be found.
   */
  getColumnIndexByName: function (sheet, columnName) {
    return this.getColumnTitlesAsArray(sheet).indexOf(columnName);
  },

  /**
   * Returns an indicator for whether or not the specified column exists (case-sensitively).
   *
   * @param {Sheet} sheet the sheet to check for the specified column name.
   * @param {string} columnName the name of the column to search for.
   * @return {boolean} whether or not the specified columnName exists in the specified sheet.
   */
  doesColumnExist: function (sheet, columnName) {
    return this.getColumnIndexByName(sheet, columnName) >= 0;
  },

  createColumn: function (sheet, columnName) {
    var lastColumn = sheet.getLastColumn();
    if (lastColumn === 0) {
      sheet.insertColumns(1);
    } else {
      sheet.insertColumnAfter(lastColumn);
    }

    lastColumn++;
    sheet.getRange(1, lastColumn, 1, 1).setValue(columnName);
  },
};
