var GlobalConfig = {
  /**
   * The suffix that will be appended to the end of the scripts that get created
   * when the data is being sectioned out into separate spreadsheets.
   */
  categorySpecificSpreadsheetSuffix: '-Survey-Data',

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

function debug() {
  var currentSpreadSheet = SpreadsheetApp.openById(GlobalConfig.spreadsheetIdToAttachTo);
  var sheet = currentSpreadSheet.getSheets()[0];
  var range = sheet.getRange(61, 1, 1, 20);
  onSurveySubmission({ range: range });
}

/**
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} e.source the spreadsheet that was opened.
 */
function spreadsheetOpened(e) {
  Main.UIHandler.createMenus(e.source);
}

function onSurveySubmission(e) {
  Main.SubmissionHandler.handleSurveySubmission(e);
}

function generateAggregateSheet() {
  Main.UIHandler.generateAggregateSheet();
}

function exportResults() {
  Main.SubmissionHandler.reExportResults();
}

function copySheetToCategorySpecificSheets(sheetName, shouldHideSheet) {
  var originalSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = spreadsheet.getSheets()[0];
  var allAvailableCategories = Model.CategoryFactory.createAllCategories();
  Model.CategoryFactory.associateSpreadsheetsToAllCategories(allAvailableCategories, masterSheet);
  allAvailableCategories.forEach(function (element) {
    var existingSheet = element.spreadsheet.getSheetByName(sheetName);
    if (existingSheet !== null) {
      element.spreadsheet.deleteSheet(existingSheet);
    }

    var copiedSheet = originalSheet.copyTo(element.spreadsheet).setName(sheetName);

    if (shouldHideSheet) {
      copiedSheet.hideSheet();
    }
  });
}

function copyReportToSubsheets() {
  copySheetToCategorySpecificSheets('Report', false);
}

function copyLeadershipCommunityToSubsheets() {
  var sheetName = 'LeadershipCommunity';
  var originalSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  // sort by the assignment identifier.  This lets the vlookup work correctly given that the
  // key fields needs to be sorted (or you have to indicate that it's not sorted and result
  // in worse performance)
  originalSheet.sort(1);

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = spreadsheet.getSheets()[0];
  var allAvailableCategories = Model.CategoryFactory.createAllCategories();
  Model.CategoryFactory.associateSpreadsheetsToAllCategories(allAvailableCategories, masterSheet);
  allAvailableCategories.forEach(function (category) {
    var existingCategorySheet = category.spreadsheet.getSheetByName(sheetName);
    if (existingCategorySheet !== null) {
      category.spreadsheet.deleteSheet(existingCategorySheet);
    }

    var copiedSheet = originalSheet.copyTo(category.spreadsheet).setName(sheetName);
    copiedSheet.hideSheet();

    var assignmentIdentifierRange = category.spreadsheet.getRange(
      'LeadershipCommunity!A2:A');
    var assignmentIdentifiersRule = SpreadsheetApp.newDataValidation()
                                                  .requireValueInRange(assignmentIdentifierRange)
                                                  .build();

    var dataSheet = category.spreadsheet.getSheetByName('Data');

    dataSheet.getRange('V2:V').setDataValidation(assignmentIdentifiersRule);

    var lastRow = dataSheet.getLastRow();

    // headers only
    if (lastRow == 1) {
      return;
    }

    var forumlaRange = dataSheet.getRange('Z2:AB' + lastRow);
    var formulaData = forumlaRange.getValues();

    var lcStudyLeaderIndex = 0;
    var regionIndex = 1;
    var ministryAreaIndex = 2;
    formulaData.forEach(function (row, index) {
      var formulaRowIndex = 2 + index;

      row[lcStudyLeaderIndex] =
        '=iferror(VLOOKUP(V' + formulaRowIndex + ', LeadershipCommunity!A2:F, 4), "")';
      row[regionIndex] =
        '=iferror(VLOOKUP(V' + formulaRowIndex + ', LeadershipCommunity!A2:F, 5), "")';
      row[ministryAreaIndex] =
        '=iferror(VLOOKUP(V' + formulaRowIndex + ', LeadershipCommunity!A2:F, 6), "")';
    });

    forumlaRange.setValues(formulaData);
  });
}

var Main = Main || {};

Main.SubmissionHandler = (function () {
  var _reExportResults = function () {
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

  var _handleSurveySubmission = function (e) {
    var range = e.range;
    var values = range.getValues();
    var masterSheet = range.getSheet();

    // get master sheet headers
    var masterSheetHeaders = SheetUtility.getColumnTitlesAsArray(masterSheet);

    // push empty values into the columns so that all values will be populated
    for (var i = 0; i < masterSheetHeaders.length; i++) {
      if (values[0][i] === undefined) {
        values[0].push('');
      }
    }

    // get generated data column index values
    var uuidColumnIndex = SheetUtility.getColumnIndexByName(range.getSheet(),
                                                            GlobalConfig.uuidColumnKey);
    var exportedColumnIndex = SheetUtility.getColumnIndexByName(range.getSheet(),
                                                                GlobalConfig.exportedColumnKey);

    // populate the generated data in the values array
    values[0][uuidColumnIndex] = Utilities.getUuid();
    values[0][exportedColumnIndex] = true;

    // retrieve the range from the master that the updated data will be added to
    var rangeToUpdate = masterSheet.getRange(range.getRowIndex(), 1, 1,
                                             masterSheet.getLastColumn());

    // get category specific headers
    var categorySpecificHeaders = masterSheetHeaders.filter(function (element) {
      return element !== GlobalConfig.exportedColumnKey;
    });

    // create all categories and find which one matches
    var categories = Model.CategoryFactory.createAllCategories();
    var matchingCategory;
    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      if (categories[categoryIndex].matches(masterSheetHeaders, values[0])) {
        matchingCategory = categories[categoryIndex];
        break;
      }
    }

    // fail if there is no matching category
    if (matchingCategory === undefined) {
      return;
    }

    // associate the spreadsheet information to the matched category
    Model.CategoryFactory.associateSpreadsheetsToAllCategories([matchingCategory], masterSheet);

    // Construct the category specific sheet
    var parentFolder = SheetUtility.getParentFolderOfSpreadsheet(masterSheet.getParent());
    var categorySpecificSpreadsheet = new Model.CategorySpecificSpreadsheet(
      matchingCategory.categoryName, parentFolder, categorySpecificHeaders);

    // set up the data to be exported
    var categorySpecificValues = values[0].filter(function (element, index) {
      return index !== exportedColumnIndex;
    });

    categorySpecificSpreadsheet.dataToExport.push(categorySpecificValues);

    // construct the processed master sheet
    var categorySpecificSpreadsheets = {};
    categorySpecificSpreadsheets[matchingCategory.categoryName] = categorySpecificSpreadsheet;

    // set up the processed master sheet
    var categories = [];
    categories.push(matchingCategory);
    var processedMasterSheet = new Model.ProcessedMasterSheet(categorySpecificSpreadsheets,
      categories, -1, undefined);

    // write all data to sheets
    DataProcessing.CategorySpecificSpreadsheetPopulator.populateCategorySpecificSpreadsheets(
      processedMasterSheet);
    rangeToUpdate.setValues(values);
    SpreadsheetApp.flush();
  };

  return {
    reExportResults: _reExportResults,
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

    if (spreadsheet.getSheetByName('Aggregate') == null) {
      menus.push({ name: 'Create Aggregate Sheet', functionName: 'generateAggregateSheet' });
    } else {
      menus.push({ name: 'Update Aggregate Sheet', functionName: 'generateAggregateSheet' });
    }

    menus.push(null);
    menus.push({ name: 'Copy Report To Category Sheets', functionName: 'copyReportToSubsheets' });
    menus.push({
                 name: 'Copy LeadershipCommunity to Category Sheets',
                 functionName: 'copyLeadershipCommunityToSubsheets'
               });

    menus.push(null);
    menus.push({ name: 'Re-Export Results', functionName: 'exportResults' });

    spreadsheet.addMenu(menuText, menus);
  };

  var _generateAggregateSheet = function () {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var masterSheet = spreadsheet.getSheets()[0];
    var aggregateSheet = spreadsheet.getSheetByName('Aggregate');
    if (aggregateSheet === null) {
      aggregateSheet = spreadsheet.insertSheet('Aggregate', spreadsheet.getNumSheets());
    }

    UUIDGenerator.populateAnyMissingValuesInTheUUIDColumn(masterSheet);
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
    if (!SheetUtility.doesColumnExist(masterSheet, GlobalConfig.exportedColumnKey)) {
      SheetUtility.createColumn(masterSheet, GlobalConfig.exportedColumnKey);
    }

    Main.UIHandler.createMenus(spreadsheet);
  };

  return {
    createMenus: _createMenus,
    generateAggregateSheet: _generateAggregateSheet
  };
})();
