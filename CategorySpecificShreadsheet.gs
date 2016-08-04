var Model = Model || {};

Model.CategorySpecificSpreadsheet = function (category, parentFolder, headers) {

  /**
   * Constructs the spreadsheet name that will be used specifically for this category.
   *
   * @param {string} spreadsheetCategoryName The category name of the spreadsheet.
   * @returns {string} The full name of the spreadsheet that should be used for this category.
   * @private
   */
  var _constructCategorySpreadsheetName = function (spreadsheetCategoryName) {
    return spreadsheetCategoryName + GlobalConfig.splitSpreadsheetSuffix;
  };

  /**
   * Retrieves the existing spreadsheet based on th e provided parent folder and spreadsheet name.
   * If no spreadsheet can be found, null will be returned.
   *
   * @param parentFolder the parent folder to search within when looking for the spreadsheet.
   * @param {string} spreadsheetName the name of the spreadsheet to retrieve.
   * @returns {null|GoogleAppsScript.Spreadsheet.Spreadsheet} if a spreadsheet can be found, the
   *            spreadsheet will be returned, otherwise null will be returned.
   * @private
   */
  var _getExistingSpreadsheet = function (parentFolder, spreadsheetName) {
    var spreadsheetIterator = parentFolder.getFilesByName(spreadsheetName);
    if (spreadsheetIterator.hasNext()) {
      SpreadsheetApp.openById(spreadsheetIterator.next().getId());
    }

    return null;
  };

  /**
   * Removes all parent folders from the specified spreadsheet.  This is useful because by default
   * when app-script creates a new file, it will have a parent as the user's 'My Drive'.
   *
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet the spreadsheet to remove all
   *                                                               parent folders from.
   * @private
   */
  var _removeAllParentFoldersFromSpreadsheet = function (spreadsheet) {
    var file = DriveApp.getFileById(spreadsheet.getId());
    var parentFolderIterator = file.getParents();
    while (parentFolderIterator.hasNext()) {
      parentFolderIterator.next().removeFile(file);
    }
  };

  /**
   * Creates a new spreadsheet in the specified folder with the given name and the starting headers.
   *
   * @param {GoogleAppsScript.Drive.Folder} parentFolder the parent folder to store the newly
   *                                                     created spreadsheet.  All other parents
   *                                                     will be removed from the newly created
   *                                                     spreadsheet.
   * @param {string} spreadsheetName The name of the spreadsheet to create.
   * @param {array} headers The headers that will be a part of the newly created spreadsheet.
   *
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} the spreadsheet that was created.
   * @private
   */
  var _createNewSpreadsheet = function (parentFolder, spreadsheetName, headers) {
    var newSpreadsheet = SpreadsheetApp.create(spreadsheetName);

    _removeAllParentFoldersFromSpreadsheet(newSpreadsheet);
    parentFolder.addFile(DriveApp.getFileById(newSpreadsheet.getId()));
    newSpreadsheet.appendRow(headers);

    return newSpreadsheet;
  };

  var _retrieveCategorySpecificSpreadsheet = function (category, parentFolder, headers) {
    var spreadsheetName = _constructCategorySpreadsheetName(category);
    var existingSpreadsheet = _getExistingSpreadsheet(parentFolder, spreadsheetName);
    if (existingSpreadsheet === null) {
      return _createNewSpreadsheet(parentFolder, spreadsheetName, headers);
    }

    return existingSpreadsheet;
  };

  this.category = category;
  this.spreadsheet = _retrieveCategorySpecificSpreadsheet(category, parentFolder, headers);
};
