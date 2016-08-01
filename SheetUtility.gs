var SheetUtility = {
  /**
   * Gets the column titles from the specified sheet.
   *
   * @param {Sheet} sheet the sheet to inspect for the column titles.
   * @returns {Array} an array representing the column titles.
   */
  getColumnTitles: function (sheet) {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
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
    var columnTitles = this.getColumnTitles(sheet)[0];
    for (var i = 0; i < columnTitles.length; i++) {
      if (columnTitles[i] === columnName) {
        return i;
      }
    }

    return -1;
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
    var columnTitles = SheetUtility.getColumnTitles(sheet);
    columnTitles[0].push(columnName);
    sheet.getRange(1, 1, 1, lastColumn + 1).setValues(columnTitles);
  },
};
