var Test = Test || {};

Test.CategorySpecificSpreadsheetTest = (function () {

  var _testSpreadsheetAlreadyExists = function () {
    var folderWithExistingSpreadsheet = DriveApp.getFolderById('0B-yIe9XImt25V2xQbTZweWVhUkk');
    var category = 'A';
    var spreadsheetName = category + GlobalConfig.categorySpecificSpreadsheetSuffix;
    var headers = [];

    var categorySpecificSpreadsheet =
      new Model.CategorySpecificSpreadsheet(category, folderWithExistingSpreadsheet, headers);

    Assert.equal(categorySpecificSpreadsheet.spreadsheet.getId(),
                 '1kjsIcvAzuHUU93ufY_zeLB80YWYpj3O15AMAzIuGJZ8');
    Assert.equal(categorySpecificSpreadsheet.spreadsheet.getName(), spreadsheetName);
    Assert.equal(categorySpecificSpreadsheet.category, category);
    Assert.equal(categorySpecificSpreadsheet.dataToExport, []);
  };

  var _testSpreadsheetDoesNotExist = function () {
    var folderWithMissingSpreadsheet = DriveApp.getFolderById('0B-yIe9XImt25Qlc0Y2F0aWFvc00');
    var category = 'A';
    var spreadsheetName = category + GlobalConfig.categorySpecificSpreadsheetSuffix;
    var headers = ['Header1', 'Header2'];
    _removeSpreadsheetsInFolderIfExisting(spreadsheetName, folderWithMissingSpreadsheet);

    var categorySpecificSpreadsheet =
      new Model.CategorySpecificSpreadsheet(category, folderWithMissingSpreadsheet, headers);

    Assert.equal(categorySpecificSpreadsheet.spreadsheet.getName(), spreadsheetName);
    Assert.equal(categorySpecificSpreadsheet.category, category);
    Assert.equal(categorySpecificSpreadsheet.dataToExport, []);

    var newSpreadsheet = categorySpecificSpreadsheet.spreadsheet;
    Assert.equal(SheetUtility.getColumnTitlesAsArray(newSpreadsheet.getSheets()[0]), headers);

    _removeSpreadsheetsInFolderIfExisting(spreadsheetName, folderWithMissingSpreadsheet);
  };

  var _testMultipleSpreadsheetsExist = function () {
    var folderWithExistingSpreadsheet = DriveApp.getFolderById('0B-yIe9XImt25N2piSzZ2bkN5N00');
    var category = 'A';
    var headers = [];

    var errorThrown = false;
    try {
      new Model.CategorySpecificSpreadsheet(category, folderWithExistingSpreadsheet, headers);
    } catch (e) {
      errorThrown = true;
    }

    if (!errorThrown) {
      throw 'Failed to throw error when multiple spreadsheets with the same name exists';
    }
  };

  var _removeSpreadsheetsInFolderIfExisting = function (sheetName, parentFolder) {
    Utility.Debugger.debug('entering _removeSpreadsheetsInFolderIfExisting method');
    var fileIterator = parentFolder.getFilesByName(sheetName);
    while (fileIterator.hasNext()) {
      var file = fileIterator.next();
      Utility.Debugger.debug('Removing file: ' + file.getName() + ' with id: ' + file.getId());
      parentFolder.removeFile(file);
    }
  };

  return {
    testSpreadsheetAlreadyExists: _testSpreadsheetAlreadyExists,
    testSpreadsheetDoesNotExist: _testSpreadsheetDoesNotExist,
    testMultipleSpreadsheetsExist: _testMultipleSpreadsheetsExist
  };
})();
