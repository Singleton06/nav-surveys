var Test = Test || {};

Test.CategorySpecificSpreadsheetTest = (function () {
  var _testConstructor = function () {
    var category = 'a';
    var spreadsheet = {};
    var spreadsheetName = 'test';
    var mockColumnIndex = 1;

    var categorySpecificSpreadsheet = new Model.CategorySpecificSpreadsheet(category, spreadsheet,
      spreadsheetName, mockColumnIndex);

    Assert.equal(categorySpecificSpreadsheet.category, category);
    Assert.equal(categorySpecificSpreadsheet.spreadsheet, spreadsheet);
    Assert.equal(categorySpecificSpreadsheet.spreadsheetName, spreadsheetName);
    Assert.equal(categorySpecificSpreadsheet.uuidColumnIndex, mockColumnIndex);
  };

  var _testConstructorMultipleInstances = function () {
    var category = 'a';
    var spreadsheet = {};
    var spreadsheetName = 'test';
    var mockColumnIndex = 1;

    var categorySpecificSpreadsheet = new Model.CategorySpecificSpreadsheet(category, spreadsheet,
      spreadsheetName, mockColumnIndex);
    var categorySpecificSpreadsheet2 = new Model.CategorySpecificSpreadsheet('b',
      { data: 'something' }, 'ssName', 2);

    Assert.equal(categorySpecificSpreadsheet.category, category);
    Assert.equal(categorySpecificSpreadsheet.spreadsheet, spreadsheet);
    Assert.equal(categorySpecificSpreadsheet.spreadsheetName, spreadsheetName);
    Assert.equal(categorySpecificSpreadsheet.uuidColumnIndex, mockColumnIndex);
    Assert.equal(categorySpecificSpreadsheet2.category, 'b');
    Assert.equal(categorySpecificSpreadsheet2.spreadsheet.data, 'something');
    Assert.equal(categorySpecificSpreadsheet2.spreadsheetName, 'ssName');
    Assert.equal(categorySpecificSpreadsheet2.uuidColumnIndex, 2);
  };

  return {
    testConstructor: _testConstructor,
    testConstructor_multipleInstances: _testConstructorMultipleInstances,
  };
})();
