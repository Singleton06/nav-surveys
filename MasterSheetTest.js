var Test = Test || {};

Test.MasterSheetTest = (function () {
  var spreadsheet = SpreadsheetApp.openById('1fTrQLkefKo7R7VLM93BT7HL05YWhkUv1lKr9nWucsbk');
  var sheetWithData = spreadsheet.getSheetByName('TestSheet');
  var sheetWithoutData = spreadsheet.getSheetByName('TestSheet-NoData');
  var sheetWithoutHeadersOrData = spreadsheet.getSheetByName('TestSheet-NoHeadersNoData');
  var sheetWithUUIDAndSplittingColumn = spreadsheet.getSheetByName(
    'TestSheet-UUIDAndSplittingColumn');

  var _testConstructor = function () {
    var expectedData = [['TestData1Col1', 'TestData1Col2'], ['TestData2Col1', 'TestData2Col2']];

    var masterSheet = new Model.MasterSheet(sheetWithData);

    Assert.equal(masterSheet.spreadsheet.getId(), spreadsheet.getId());

    // Compare based off of the name given that within a single spreadsheet, the name will be unique
    Assert.equal(masterSheet.sheet.getName(), sheetWithData.getName());

    // this is the id of the parent containing the test file
    Assert.equal(masterSheet.parentFolder.getId(), '0B-yIe9XImt25YTJoY3BqZ2RTRjg');
    Assert.equal(masterSheet.allData, expectedData);
    Assert.equal(masterSheet.headers, ['Header1', 'Header2']);
    Assert.equal(masterSheet.exportedColumnIndex, -1);
  };

  var _testConstructorSheetWithoutData = function () {
    var expectedData = [];

    var masterSheet = new Model.MasterSheet(sheetWithoutData);

    Assert.equal(masterSheet.spreadsheet.getId(), spreadsheet.getId());

    // Compare based off of the name given that within a single spreadsheet, the name will be unique
    Assert.equal(masterSheet.sheet.getName(), sheetWithoutData.getName());

    // this is the id of the parent containing the test file
    Assert.equal(masterSheet.parentFolder.getId(), '0B-yIe9XImt25YTJoY3BqZ2RTRjg');
    Assert.equal(masterSheet.allData, expectedData);
    Assert.equal(masterSheet.headers, ['Header1', 'Header2']);
    Assert.equal(masterSheet.exportedColumnIndex, -1);
  };

  var _testConstructorNoHeaderNoData = function () {
    var expectedData = [];

    var masterSheet = new Model.MasterSheet(sheetWithoutHeadersOrData);

    Assert.equal(masterSheet.spreadsheet.getId(), spreadsheet.getId());

    // Compare based off of the name given that within a single spreadsheet, the name will be unique
    Assert.equal(masterSheet.sheet.getName(), sheetWithoutHeadersOrData.getName());

    // this is the id of the parent containing the test file
    Assert.equal(masterSheet.parentFolder.getId(), '0B-yIe9XImt25YTJoY3BqZ2RTRjg');
    Assert.equal(masterSheet.allData, expectedData);
    Assert.equal(masterSheet.headers, []);
    Assert.equal(masterSheet.exportedColumnIndex, -1);
  };

  var _testConstructorUUIDAndSplittingColumn = function () {
    var expectedData = [['TestData1Col1', 'TestData1Col2', 'TestData1Col3']];
    var expectedHeaders = ['Header1', GlobalConfig.exportedColumnKey, 'Header3'];

    var masterSheet = new Model.MasterSheet(sheetWithUUIDAndSplittingColumn);

    Assert.equal(masterSheet.spreadsheet.getId(), spreadsheet.getId());

    // Compare based off of the name given that within a single spreadsheet, the name will be unique
    Assert.equal(masterSheet.sheet.getName(), sheetWithUUIDAndSplittingColumn.getName());

    // this is the id of the parent containing the test file
    Assert.equal(masterSheet.parentFolder.getId(), '0B-yIe9XImt25YTJoY3BqZ2RTRjg');
    Assert.equal(masterSheet.allData, expectedData);
    Assert.equal(masterSheet.headers, expectedHeaders);
    Assert.equal(masterSheet.exportedColumnIndex, 1);
  };

  return {
    testConstructor: _testConstructor,
    testConstructorSheetWithoutData: _testConstructorSheetWithoutData,
    testConstructorNoHeaderNoData: _testConstructorNoHeaderNoData,
    testConstructorUUIDAndSplittingColumn: _testConstructorUUIDAndSplittingColumn,
  };
})();
