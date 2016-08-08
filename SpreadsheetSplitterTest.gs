var Test = Test || {};

function runSpreadsheetSplitterTest() {
  RunTests('SpreadsheetSplitterTest');
}

function runTestSplitSpreadsheetsByCategoriesWithMultipleEntiresInSameCategory() {
  RunTests('SpreadsheetSplitterTest',
           'testSplitSpreadsheetsByCategoriesWithMultipleEntiresInSameCategory');
}

function runTestSplitSpreadsheetsByCategoriesWithoutExportColumn() {
  RunTests('SpreadsheetSplitterTest',
           'testSplitSpreadsheetsByCategoriesWithoutExportColumn');
}

Test.SpreadsheetSplitterTest = (function () {
  var testSpreadsheet = SpreadsheetApp.openById('1d7bG_IR7ZE1hcH9wM6MFxOEtXzTRBjANgRmraju41c0');
  var missingExportedColumnSheet = testSpreadsheet.getSheetByName('MissingExportedColumn');
  var multipleEntiresSameCategorySheet = testSpreadsheet.getSheetByName(
    'MultipleEntriesSameCategory');
  var allDataExportedSheet = testSpreadsheet.getSheetByName('AllDataExported');
  var partialDataExportedSheet = testSpreadsheet.getSheetByName('PartialDataExported');
  var middleEntryNotExportedSheet = testSpreadsheet.getSheetByName('MiddleEntryNotExported');

  var _testSplitSpreadsheetsByCategoriesWithoutExportedColumn = function () {
    var headers = SheetUtility.getColumnTitlesAsRange(missingExportedColumnSheet);
    var exportedColumnHeaderIndex = headers.getValues()[0].indexOf(GlobalConfig.exportedColumnKey);
    if (exportedColumnHeaderIndex !== -1) {
      headers.getCell(1, exportedColumnHeaderIndex + 1).setValue('');
    }

    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      missingExportedColumnSheet);
    var categorySpecificSheets = processedMasterSheet.categorySpecificSpreadsheets;

    var headersAfterProcessing = SheetUtility.getColumnTitlesAsRange(missingExportedColumnSheet);
    var exportedColumnHeaderIndexAfterProcessing = headersAfterProcessing.getValues()[0].indexOf(
      GlobalConfig.exportedColumnKey);
    Assert.equal(exportedColumnHeaderIndexAfterProcessing !== -1, true);
    Assert.equal(Object.keys(categorySpecificSheets).length, 0);

    headersAfterProcessing.getCell(1, exportedColumnHeaderIndexAfterProcessing + 1).setValue('');
  };

  var _testSplitSpreadsheetsByCategoriesWithMultipleEntiresInSameCategory = function () {
    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      multipleEntiresSameCategorySheet);
    var categorySpecificSheets = processedMasterSheet.categorySpecificSpreadsheets;

    var categoryA = categorySpecificSheets.a;
    Assert.equal(categoryA.category, 'a');
    Assert.equal(categoryA.spreadsheet.getName(),
                 'a' + GlobalConfig.categorySpecificSpreadsheetSuffix);
    Assert.equal(categoryA.dataToExport, [['column1Value1', 'column2Value1', 'a'],
      ['column1Value3', 'column2Value3', 'a']]);
    DriveApp.getFileById(categoryA.spreadsheet.getId()).setTrashed(true);

    var categoryB = categorySpecificSheets.b;
    Assert.equal(categoryB.category, 'b');
    Assert.equal(categoryB.spreadsheet.getName(),
                 'b' + GlobalConfig.categorySpecificSpreadsheetSuffix);
    Assert.equal(categoryB.dataToExport, [['column1Value2', 'column2Value2', 'b']]);
    DriveApp.getFileById(categoryB.spreadsheet.getId()).setTrashed(true);

    Assert.equal(processedMasterSheet.categories, ['a', 'b']);
    Assert.equal(processedMasterSheet.lastProcessedRowIndex, 3);

  };

  var _testSplitSpreadsheetsByCategoriesWithAllDataExported = function () {
    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      allDataExportedSheet);
    var categorySpecificSheets = processedMasterSheet.categorySpecificSpreadsheets;

    Assert.equal(Object.keys(categorySpecificSheets).length, 0);
    Assert.equal(categorySpecificSheets.a, undefined);
    Assert.equal(categorySpecificSheets.b, undefined);
    Assert.equal(processedMasterSheet.lastProcessedRowIndex, -1);
  };

  var _testSplitSpreadsheetsByCategoriesWithPartialDataExported = function () {
    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      partialDataExportedSheet);
    var categorySpecificSheets = processedMasterSheet.categorySpecificSpreadsheets;

    var categoryA = categorySpecificSheets.a;
    Assert.equal(categoryA.category, 'a');
    Assert.equal(categoryA.spreadsheet.getName(),
                 'a' + GlobalConfig.categorySpecificSpreadsheetSuffix);
    Assert.equal(categoryA.dataToExport, [['column1Value3', 'column2Value3', 'a']]);
    DriveApp.getFileById(categoryA.spreadsheet.getId()).setTrashed(true);

    Assert.equal(categorySpecificSheets.b, undefined);
    Assert.equal(processedMasterSheet.lastProcessedRowIndex, 3);
    Assert.equal(processedMasterSheet.categories, ['a']);
  };

  var _testSplitSpreadsheetsByCategoriesWithMiddleEntryNotExported = function () {
    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      middleEntryNotExportedSheet);
    var categorySpecificSheets = processedMasterSheet.categorySpecificSpreadsheets;

    Assert.equal(categorySpecificSheets.a, undefined);

    var categoryB = categorySpecificSheets.b;
    Assert.equal(categoryB.category, 'b');
    Assert.equal(categoryB.spreadsheet.getName(),
                 'b' + GlobalConfig.categorySpecificSpreadsheetSuffix);
    Assert.equal(categoryB.dataToExport, [['column1Value2', 'column2Value2', 'b']]);
    Assert.equal(processedMasterSheet.lastProcessedRowIndex, 2);
    Assert.equal(processedMasterSheet.categories, ['b']);
    DriveApp.getFileById(categoryB.spreadsheet.getId()).setTrashed(true);
  };

  //@formatter:off
  return {
    testSplitSpreadsheetsByCategoriesWithoutExportColumn:
      _testSplitSpreadsheetsByCategoriesWithoutExportedColumn,

    testSplitSpreadsheetsByCategoriesWithMultipleEntiresInSameCategory:
      _testSplitSpreadsheetsByCategoriesWithMultipleEntiresInSameCategory,

    testSplitSpreadsheetsByCategoriesWithAllDataExported:
      _testSplitSpreadsheetsByCategoriesWithAllDataExported,

    testSplitSpreadsheetsByCategoriesWithPartialDataExported:
      _testSplitSpreadsheetsByCategoriesWithPartialDataExported,

    testSplitSpreadsheetsByCategoriesWithMiddleEntryNotExported:
      _testSplitSpreadsheetsByCategoriesWithMiddleEntryNotExported
  };

  //@formatter:on
})();
