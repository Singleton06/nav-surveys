var Test = Test || {};

function runCategorySpecificSpreadsheetPopulatorTest() {
  RunTests('CategorySpecificSpreadsheetPopulatorTest');
}

Test.CategorySpecificSpreadsheetPopulatorTest = (function () {
  var testFolder = DriveApp.getFolderById('0B-yIe9XImt25alcxS2Z4UnNqdE0');
  var spreadsheetTemplateFile =
    DriveApp.getFileById('1n9ChTA4XOkxt8C7WeghzaCFMSTCbXMh-aq-cxPcLdtc');

  /**
   * Creates a copy of the file in the test directory and then translates it into a spreadsheet
   * object.
   *
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} the copied spreadsheet.
   * @private
   */
  var _copyTemplate = function (name) {
    var copiedFile = spreadsheetTemplateFile.makeCopy(name, testFolder);
    return SpreadsheetApp.openById(copiedFile.getId());
  };

  var _testPopulateCategorySpecificSpreadsheetsNoExportedData = function () {
    var allData = [['Header1', 'UUID', 'Hall'],
      ['col1Value1', 'col2Value1', 'a'],
      ['col1Value2', 'col2Value2', 'a']];
    var dataToExport = [allData[1], allData[2]];
    var headers = allData[0];

    var category = { categoryName: 'a' };
    var categorySpecificSpreadsheet = new Model.CategorySpecificSpreadsheet(category.categoryName,
      testFolder, headers);

    try {
      var processedMasterSheet = new Model.ProcessedMasterSheet({ a: categorySpecificSpreadsheet },
        [category], 2, null);
      categorySpecificSpreadsheet.dataToExport = dataToExport;

      DataProcessing.CategorySpecificSpreadsheetPopulator.populateCategorySpecificSpreadsheets(
        processedMasterSheet);

      Assert.equal(categorySpecificSpreadsheet.spreadsheet.getDataRange().getValues(), allData);
    } finally {
      DriveApp.getFileById(categorySpecificSpreadsheet.spreadsheet.getId()).setTrashed(true);
    }
  };

  var _testPopulateCategorySpecificSpreadsheetDataAlreadyExported = function () {
    var copiedSpreadsheet = _copyTemplate('b' + GlobalConfig.categorySpecificSpreadsheetSuffix);
    var allData = [['Header1', 'UUID', 'Hall'],
      ['col1Value1', 'col2Value1', 'b'],
      ['col1Value2', 'col2Value2', 'b'],
      ['col1Value3', 'col2Value3', 'b'],
      ['col1Value4', 'col2Value4', 'b']];

    var dataToExport = [allData[3], allData[4]];
    var headers = allData[0];

    var category = { categoryName: 'b' };
    var categorySpecificSpreadsheet = new Model.CategorySpecificSpreadsheet(category.categoryname,
      testFolder, headers);

    try {
      var processedMasterSheet = new Model.ProcessedMasterSheet({ b: categorySpecificSpreadsheet },
        [category], 5, null);
      categorySpecificSpreadsheet.dataToExport = dataToExport;

      DataProcessing.CategorySpecificSpreadsheetPopulator.populateCategorySpecificSpreadsheets(
        processedMasterSheet);

      Assert.equal(categorySpecificSpreadsheet.spreadsheet.getId(), copiedSpreadsheet.getId());
      Assert.equal(categorySpecificSpreadsheet.spreadsheet.getDataRange().getValues(), allData);
    } finally {
      DriveApp.getFileById(categorySpecificSpreadsheet.spreadsheet.getId()).setTrashed(true);
    }
  };

  //@formatter:off
  return {
    testPopulateCategorySpecificSpreadsheetsNoExportedData:
      _testPopulateCategorySpecificSpreadsheetsNoExportedData,

    testPopulateCategorySpecificSpreadsheetDataAlreadyExported:
      _testPopulateCategorySpecificSpreadsheetDataAlreadyExported
  };

  //@formatter:on
})();
