//noinspection JSUnusedGlobalSymbols
function runSheetUtilityTest() {
  for (var test in SheetUtilityTest) {
    Logger.log('Running test ' + test);
    if (typeof SheetUtilityTest[test] === 'function') {
      SheetUtilityTest[test]();
    }

    Logger.log('Ran test ' + test);
  }
}

//noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
var SheetUtilityTest = {
  sheet: SpreadsheetApp.openById('1sX0Xk9B_ngVOCGc_wwWBvg4g-AdfBjv0dC7xEHnUdV4').getActiveSheet(),

  testGetColumnIndexByName: function () {
    Assert.equal(SheetUtility.getColumnIndexByName(this.sheet, 'UUID'), 3);
    Assert.equal(SheetUtility.getColumnIndexByName(this.sheet, 'Timestamp'), 0);
    Assert.equal(SheetUtility.getColumnIndexByName(this.sheet, 'DOES NOT EXIST'), -1);
  },

  testDoesUUIDColumnExist: function () {
    Assert.equal(SheetUtility.doesColumnExist(this.sheet, 'UUID'), true);
    Assert.equal(SheetUtility.doesColumnExist(this.sheet, 'Timestamp'), true);
    Assert.equal(SheetUtility.doesColumnExist(this.sheet, 'timestamp'), false);
    Assert.equal(SheetUtility.doesColumnExist(this.sheet, 'uuid'), false);
  },
};
