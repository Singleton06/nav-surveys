var Test = Test || {};

Test.SpreadsheetSplitterTest = (function () {
  /*
  Tests:
  - spreadsheet with exported column missing
  - spreadsheet with exported column
  - ensure that the category specific sheets do not have the exported column
  - entries with no category specified are ignored
  - multiple entries for the same category
  - last exported column row index is correct
   */
  var _splitSpreadsheetsByCategories = function () {

  };

  return {
    splitSpreadsheetsByCategories: _splitSpreadsheetsByCategories,
  };
})();
