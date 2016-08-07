var Model = Model || {};

/**
 * Model object representing a spreadsheet's data that is specific to a single category.  This
 * sheet can be used to contain information that will at a later time be added to this specific
 * sheet.
 *
 * @param {String} category The category name that the category specific spreadsheet pertains to.
 * @param {GoogleAppsScript.Drive.Folder} parentFolder the parent folder that should contain the
 *   spreadsheet.
 * @param {String[]} headers the headers that the category specific spreadsheet should contain.
 * @constructor
 */
Model.CategorySpecificSpreadsheet = function (category, parentFolder, headers) {
  Utility.Debugger.debug('CategorySpecificSpreadsheet constructor called with values: category: ['
                         + category + '] parentFolder with name: [' + parentFolder.getName()
                         + '] headers: [' + headers + ']');

  /**
   * Constructs the spreadsheet name that will be used specifically for this category.
   *
   * @param {string} spreadsheetCategoryName The category name of the spreadsheet.
   * @returns {string} The full name of the spreadsheet that should be used for this category.
   * @private
   */
  var _constructCategorySpreadsheetName = function (spreadsheetCategoryName) {
    return spreadsheetCategoryName + GlobalConfig.categorySpecificSpreadsheetSuffix;
  };

  /**
   * Retrieves the existing spreadsheet based on th e provided parent folder and spreadsheet name.
   * If no spreadsheet can be found, null will be returned.
   *
   * @param {GoogleAppsScript.Drive.Folder} parentFolder the parent folder to search within when
   *   looking for the spreadsheet.
   * @param {string} spreadsheetName the name of the spreadsheet to retrieve.
   * @returns {null|GoogleAppsScript.Spreadsheet.Spreadsheet} if a spreadsheet can be found, the
   *            spreadsheet will be returned, otherwise null will be returned.
   * @private
   */
  var _getExistingSpreadsheet = function (parentFolder, spreadsheetName) {
    var spreadsheetIterator = parentFolder.getFilesByName(spreadsheetName);
    if (spreadsheetIterator.hasNext()) {
      var spreadsheet = SpreadsheetApp.openById(spreadsheetIterator.next().getId());

      if (spreadsheetIterator.hasNext()) {
        throw 'Found more than one spreadsheet with the same name of [' + spreadsheetName +
        '] within the parent folder [' + parentFolder.getName() + '].';
      }

      return spreadsheet;
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
   * Creates a new spreadsheet in the specified folder with the given name and the starting
   * headers.
   *
   * @param {GoogleAppsScript.Drive.Folder} parentFolder the parent folder to store the newly
   *   created spreadsheet.  All other parents will be removed from the newly created spreadsheet.
   * @param {string} spreadsheetName The name of the spreadsheet to create.
   * @param {Array} headers The headers that will be a part of the newly created spreadsheet.
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

  /**
   *
   * @param {String} category the string representing the category.
   * @param {GoogleAppsScript.Drive.Folder} parentFolder the parent folder that contains the
   *   spreadsheet.
   * @param {String[]} headers the headers that the category specific spreadsheet contains.
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} the spreadsheet that is supposed to
   *   contain the category specific information.  Note that this does not necessarily mean at this
   *   point that the spreadsheet contains any category specific information yet.  It could be
   *   empty.
   * @private
   */
  var _retrieveCategorySpecificSpreadsheet = function (category, parentFolder, headers) {
    var spreadsheetName = _constructCategorySpreadsheetName(category);
    var existingSpreadsheet = _getExistingSpreadsheet(parentFolder, spreadsheetName);
    if (existingSpreadsheet === null) {
      return _createNewSpreadsheet(parentFolder, spreadsheetName, headers);
    }

    return existingSpreadsheet;
  };

  /**
   * The category name that the category specific spreadsheet pertains to.
   *
   * @type {String}
   */
  this.category = category;

  /**
   * The spreadsheet that is supposed to contain the category specific information.  Note that this
   * does not necessarily mean at this point that the spreadsheet contains any category specific
   * information yet.  It could be empty.
   *
   * @type {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  this.spreadsheet = _retrieveCategorySpecificSpreadsheet(category, parentFolder, headers);

  /**
   * An array of all of the data that will need to be exported.  This will start off as an empty
   * array, but can be used as a place to collection information specific to this cateogry
   * that can be added to the spreadsheet.
   *
   * @type {Array}
   */
  this.dataToExport = [];
};
