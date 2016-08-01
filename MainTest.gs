//noinspection JSUnusedGlobalSymbols
function runMainTest() {
  for (var test in MainTest) {
    if (typeof MainTest[test] === 'function') {
      Logger.log('Running test ' + test);
      MainTest[test]();
      Logger.log('Ran test ' + test);
    }
  }
}

//noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
var MainTest = {
  sheet: SpreadsheetApp.openById('1sX0Xk9B_ngVOCGc_wwWBvg4g-AdfBjv0dC7xEHnUdV4').getActiveSheet(),

  testSplitDataIntoSeparateSheets: function () {
    Logger.log(Main.splitDataIntoSeparateSheets(this.sheet));
  },
};
