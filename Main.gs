var GlobalConfig = {
  /**
   * The suffix that will be appended to the end of the scripts that get created
   * when the data is being sectioned out into separate spreadsheets.
   */
  categorySpecificSpreadsheetSuffix: '-Hall-Spreadsheet',

  /**
   * The spreadsheet that contains the survey responses that will ultimately
   * trigger events based on form submissions.
   */
  spreadsheetIdToAttachTo: '1Fnfy4K1EHsmIA5ncD6MvJbd_l35Hcfsogq0_JmVGqAU',

  /**
   * Column key to store the unique identifier of each submission.
   */
  uuidColumnKey: 'UUID',

  /**
   * The column that is used to indicate in the master that the entry has been
   * exported to the subsequent sheet.
   */
  exportedColumnKey: 'Exported',
};

//noinspection JSUnusedGlobalSymbols
/**
 * This is a method that can only be called once to add the trigger to the spreadsheet/form.
 * This should not be executed more than once because it will add multiple triggers to the google
 * sheet and the behavior becomes very erradic at that point.
 */
function installTrigger() {
  var currentSpreadSheet = SpreadsheetApp.openById(GlobalConfig.spreadsheetIdToAttachTo);
  ScriptApp.newTrigger('onSurveySubmission').forSpreadsheet(currentSpreadSheet).onFormSubmit()
           .create();
  ScriptApp.newTrigger('spreadsheetOpened').forSpreadsheet(currentSpreadSheet).onOpen().create();
}

function spreadsheetOpened(e) {
  Main.UIHandler.createMenus(e.source);
}

function onSurveySubmission(e) {
  Main.SubmissionHandler.handleSurveySubmission();
}

function generateAggregateSheet() {
  Main.UIHandler.generateAggregateSheet();
}

var Main = Main || {};

Main.SubmissionHandler = (function () {
  var _handleSurveySubmission = function () {
    var currentSpreadSheet = SpreadsheetApp.openById(GlobalConfig.spreadsheetIdToAttachTo);

    // always assume first sheet from master contains survey responses
    var masterSheet = currentSpreadSheet.getSheets()[0];
    UUIDGenerator.populateAnyMissingValuesInTheUUIDColumn(masterSheet);

    var allAvailableCategories = Model.CategoryFactory.createAllCategories();

    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      masterSheet, allAvailableCategories);
    DataProcessing.CategorySpecificSpreadsheetPopulator.populateCategorySpecificSpreadsheets(
      processedMasterSheet);
    DataProcessing.ExportedColumnPopulator.populateExportedColumn(processedMasterSheet);
  };

  return {
    handleSurveySubmission: _handleSurveySubmission
  };
})();

Main.UIHandler = (function () {
  /**
   * Adds the menu to the specified spreadsheet.
   *
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet
   *      The spreadsheet to create the menu for.
   * @private
   */
  var _createMenus = function (spreadsheet) {
    var menuText = 'Nav Survey Actions';
    spreadsheet.removeMenu(menuText);
    var menus = [];

    if (spreadsheet.getSheetByName('aggregate-sheet') == null) {
      menus.push({ name: 'Create Aggregate Sheet', functionName: 'generateAggregateSheet' });
    } else {
      menus.push({ name: 'Update Aggregate Sheet', functionName: 'generateAggregateSheet' });
    }

    spreadsheet.addMenu(menuText, menus);
  };

  var _generateAggregateSheet = function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var masterSheet = spreadsheet.getSheets()[0];
    var aggregateSheet = spreadsheet.getSheetByName('aggregate-sheet');
    if (aggregateSheet === null) {
      aggregateSheet = spreadsheet.insertSheet('aggregate-sheet', spreadsheet.getNumSheets());
    }

    var allAvailableCategories = Model.CategoryFactory.createAllCategories();
    Model.CategoryFactory.associateSpreadsheetsToAllCategories(allAvailableCategories, masterSheet);

    var firstCategoryHeaders = SheetUtility.getColumnTitlesAsArray(
      allAvailableCategories[0].spreadsheet.getSheets()[0]);
    var allValues = [];
    allValues.push(firstCategoryHeaders);

    for (var i = 0; i < allAvailableCategories.length; i++) {
      var categorySheetData = SheetUtility.getSheetData(
        allAvailableCategories[i].spreadsheet.getSheets()[0]);

      for (var j = 0; j < categorySheetData.length; j++) {
        allValues.push(categorySheetData[j]);
      }
    }

    aggregateSheet.clearContents();
    aggregateSheet.getRange(1, 1, allValues.length, firstCategoryHeaders.length)
                  .setValues(allValues);
    _resizeAllColumns(aggregateSheet);

    Main.UIHandler.createMenus(spreadsheet);
  };

  /**
   * Auto-resizes all columns on the specified sheet.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
   *      The sheet to resize all columns on.
   * @private
   */
  var _resizeAllColumns = function (sheet) {
    for (var i = 1; i <= sheet.getLastColumn(); i++) {
      sheet.autoResizeColumn(i);
    }
  };

  return {
    createMenus: _createMenus,
    generateAggregateSheet: _generateAggregateSheet
  };
})();
