var Test = Test || {};

Test.SheetUtilityTest = (function () {
  var spreadsheet = SpreadsheetApp.openById('1zzrDPByVEEqD6-7bS-ciGmLK2zAEU8PHL0MzD_RCCn4');
  var noHeaderSheet = spreadsheet.getSheetByName('SheetUtilityTest-NoHeaders');
  var multipleHeaderSheet = spreadsheet.getSheetByName('SheetUtilityTest-MultipleHeaders');
  var singleHeaderSheet = spreadsheet.getSheetByName('SheetUtilityTest-SingleHeader');

  var _testGetColumnIndexByName = function () {
    Assert.equal(SheetUtility.getColumnIndexByName(multipleHeaderSheet, 'UUID'), 1);
    Assert.equal(SheetUtility.getColumnIndexByName(multipleHeaderSheet, 'Timestamp'), 0);
    Assert.equal(SheetUtility.getColumnIndexByName(multipleHeaderSheet, 'DOES NOT EXIST'), -1);
  };

  var _testDoesColumnExist = function () {
    Assert.equal(SheetUtility.doesColumnExist(multipleHeaderSheet, 'UUID'), true);
    Assert.equal(SheetUtility.doesColumnExist(multipleHeaderSheet, 'Timestamp'), true);
    Assert.equal(SheetUtility.doesColumnExist(multipleHeaderSheet, 'timestamp'), false);
    Assert.equal(SheetUtility.doesColumnExist(multipleHeaderSheet, 'uuid'), false);
  };

  var _testCreateColumn = function () {
    var newColumnName = 'testing';
    var otherNewColumnName = 'testing2';
    var newSheetName = 'SheetUtilityTest_' + 'testCreateColumn_' + new Date();
    var newlyCreatedSheet = spreadsheet.insertSheet(newSheetName);

    SheetUtility.createColumn(newlyCreatedSheet, newColumnName);

    var columnTitles = SheetUtility.getColumnTitlesAsArray(newlyCreatedSheet);
    Assert.equal(columnTitles, [newColumnName]);

    SheetUtility.createColumn(newlyCreatedSheet, otherNewColumnName);
    columnTitles = SheetUtility.getColumnTitlesAsArray(newlyCreatedSheet);
    Assert.equal(columnTitles, [newColumnName, otherNewColumnName]);

    spreadsheet.deleteSheet(newlyCreatedSheet);
  };

  var _testGetColumnTitlesAsArrayEmptyArray = function () {
    var columnTitles = SheetUtility.getColumnTitlesAsArray(noHeaderSheet);

    Assert.equal(columnTitles, []);
  };

  var _testGetColumnTitlesAsArraySingleElement = function () {
    var columnTitles = SheetUtility.getColumnTitlesAsArray(singleHeaderSheet);

    Assert.equal(columnTitles, ['Timestamp']);
  };

  var _testGetColumnTitlesAsArrayMultipleElements = function () {
    var columnTitles = SheetUtility.getColumnTitlesAsArray(multipleHeaderSheet);

    Assert.equal(columnTitles, ['Timestamp', 'UUID']);
  };

  return {
    testGetColumnIndexByName: _testGetColumnIndexByName,
    testDoesColumnExist: _testDoesColumnExist,
    testCreateColumn: _testCreateColumn,
    testGetColumnTitlesAsArrayEmptyArray: _testGetColumnTitlesAsArrayEmptyArray,
    testGetColumnTitlesAsArraySingleElement: _testGetColumnTitlesAsArraySingleElement,
    testGetColumnTitlesAsArrayMultipleElements: _testGetColumnTitlesAsArrayMultipleElements,
  };
})();
