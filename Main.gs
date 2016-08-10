var GlobalConfig = {
  /**
   * The configuration for which column that the data should be split by.
   */
  splittingColumnKey: 'Hall',

  /**
   * The suffix that will be appended to the end of the scripts that get created
   * when the data is being sectioned out into separate spreadsheets.
   */
  categorySpecificSpreadsheetSuffix: '-Hall-Spreadsheet',

  /**
   * The spreadsheet that contains the survey responses that will ultimately
   * trigger events based on form submissions.
   */
  spreadsheetIdToAttachTo: '1sX0Xk9B_ngVOCGc_wwWBvg4g-AdfBjv0dC7xEHnUdV4',

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

function generateMetaDataSheet() {
  Main.UIHandler.generateMetaDataSheet();
}

var Main = Main || {};

Main.SubmissionHandler = (function () {
  var _handleSurveySubmission = function () {
    var currentSpreadSheet = SpreadsheetApp.openById(GlobalConfig.spreadsheetIdToAttachTo);

    // always assume first sheet from master contains survey responses
    var masterSheet = currentSpreadSheet.getSheets()[0];
    UUIDGenerator.populateAnyMissingValuesInTheUUIDColumn(masterSheet);

    var processedMasterSheet = DataProcessing.SpreadsheetSplitter.splitSpreadsheetByCategories(
      masterSheet);
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
    var menus = [];

    if (spreadsheet.getSheetByName('METADATA') == null) {
      menus.push({ name: 'Generate METADATA sheet', functionName: 'generateMetaDataSheet' });
    }

    spreadsheet.addMenu('Nav Survey Actions', menus);
  };

  var _generateMetaDataSheet = function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    var form = FormApp.openByUrl(spreadsheet.getFormUrl());
    var metadataSheet = spreadsheet.insertSheet('METADATA', spreadsheet.getNumSheets());
    metadataSheet.appendRow(['current-step', 'METADATA-GENERATED'])
                 .appendRow(['spreadsheet-id', spreadsheet.getId()])
                 .appendRow(['spreadsheet-url', spreadsheet.getUrl()])
                 .appendRow(['form-id', form.getId()])
                 .appendRow(['form-published-url', form.getPublishedUrl()])

    _resizeAllColumns(metadataSheet);

    SpreadsheetApp.getUi()
                  .alert('METADATA sheet has been created.  Please fill out any blank values in '
                         + 'column b based on the provided key in column a. \n\n'
                         + 'NOTE: do not edit column A. \n\n'
                         + 'Also, the  "Nav Survey Actions" menu has been updated.  '
                         + 'Once values have been filled out, see the menu for additional '
                         + 'actions.');
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
    generateMetaDataSheet: _generateMetaDataSheet
  };
})();
