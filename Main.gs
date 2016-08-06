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
}

function onSurveySubmission(e) {
  Main.performSurveySubmission(e);
}

//noinspection JSUnusedLocalSymbols
var Main = {
  performSurveySubmission: function (e) {
    var currentSpreadSheet = SpreadsheetApp.openById(GlobalConfig.spreadsheetIdToAttachTo);
    var currentSheet = currentSpreadSheet.getActiveSheet();

    UUIDGenerator.populateAnyMissingValuesInTheUUIDColumn(currentSheet);
    this.splitDataIntoSeparateSheets(currentSheet);
  },

  splitData: function (sheet) {
    Main.createExportedColumnIfItDoesNotExist(sheet);
    var columnHeaderInformation = Main.getColumnHeaderInformation(sheet);
    var allSheetData = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    var parentFolder = this.getParentFolderOfSpreadsheet(sheet);
    var categorySpecificData = {};
    var exportedIndecies = [];
    allSheetData.forEach(function (currentRow, index) {
      var category = currentRow[columnHeaderInformation.splitColumnIndex];
      if (category === '') {
        return;
      }

      if (categorySpecificData[category] === undefined) {
        categorySpecificData[category] = Main.initializeCategorySpecificData(parentFolder, category,
          columnHeaderInformation);
      }

      if (currentRow[columnHeaderInformation.exportedColumnIndex]) {
        categorySpecificData[category].dataToAdd.push(currentRow);
        exportedIndecies.push(index);
      }
    });

    Main.populateDataInSplitForms(categorySpecificData);
  },

  initializeCategorySpecificData: function (parentFolder, category, columnHeaderInformation) {
    return {
      dataToAdd: [],
      spreadsheetInfo: Main.addSpreadsheetIfMissingAndRetrieve(parentFolder, category,
        columnHeaderInformation.headers.filter(Main.allColumnHeadersButExportedFilter)),
    };
  },

  allColumnHeadersButExportedFilter: function (value) {
    return value !== GlobalConfig.exportedColumnKey;
  },

  populateDataInSplitForms: function (categorySpecificData) {
    for (var category in categorySpecificData) {
      if (category.dataToAdd.length === 0) {
        // Skip if there is no data to add
        continue;
      }

      var spreadsheet = category.spreadsheetInfo.spreadsheet;
      var activeSheet = spreadsheet.getActiveSheet();
      var lastRowIndex = activeSheet.getLastRow();

      activeSheet.insertRowsAfter(lastRowIndex, category.dataToAdd.length);
      var dataRangeToUpdate = spreadsheet.getActiveSheet().getRange(lastRowIndex + 1, 1,
        category.dataToAdd.length, category.dataToAdd[0].length);

      dataRangeToUpdate.setValues(category.dataToAdd);
    }
  },

  splitDataIntoSeparateSheets: function (sheet) {

    Main.createExportedColumnIfItDoesNotExist(sheet);
    var columnHeaderInformation = Main.getColumnHeaderInformation(sheet);

    // skip the headers
    var allSheetData = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
    var allSheetDataValues = allSheetData.getValues();

    var parentFolder = this.getParentFolderOfSpreadsheet(sheet);
    var categoryToSpreadsheetMap = {};
    allSheetDataValues.forEach(function (currentRow, index) {
      var category = currentRow[columnHeaderInformation.splitColumnIndex];
      if (category === '') {
        return;
      }

      if (categoryToSpreadsheetMap[category] === undefined) {
        var categorySpreadsheetHeaders = columnHeaderInformation.headers.filter(function (value) {
          return value !== GlobalConfig.exportedColumnKey;
        });

        categoryToSpreadsheetMap[category] = Main.addSpreadsheetIfMissingAndRetrieve(parentFolder,
          category, categorySpreadsheetHeaders);
      }

      // add 1 to column and row to adjust for the difference between the array
      // index and cell indexing
      var exportedCell = allSheetData.getCell(index + 1,
        columnHeaderInformation.exportedColumnIndex + 1);
      if (!exportedCell.getValue()) {
        categoryToSpreadsheetMap[category].spreadsheet.appendRow(currentRow);
        exportedCell.setValue(true);
      }
    });
  },

  getColumnHeaderInformation: function (sheet) {
    return {
      exportedColumnIndex: SheetUtility.getColumnIndexByName(sheet, GlobalConfig.exportedColumnKey),
      splitColumnIndex: SheetUtility.getColumnIndexByName(sheet, GlobalConfig.splittingColumnKey),
      headers: SheetUtility.getColumnTitlesAsArray(sheet),
    };
  },

  createExportedColumnIfItDoesNotExist: function (sheet) {
    if (SheetUtility.getColumnIndexByName(sheet, GlobalConfig.exportedColumnKey) == -1) {
      SheetUtility.createColumn(sheet, GlobalConfig.exportedColumnKey);
    }
  },

  addSpreadsheetIfMissingAndRetrieve: function (parentFolder, name, headers) {
    var spreadsheetName = name + GlobalConfig.categorySpecificSpreadsheetSuffix;
    var spreadsheetIterator = parentFolder.getFilesByName(spreadsheetName);
    var spreadsheet;
    if (!spreadsheetIterator.hasNext()) {
      var newlyCreatedSpreadsheet = SpreadsheetApp.create(spreadsheetName);
      var spreadsheetFile = DriveApp.getFileById(newlyCreatedSpreadsheet.getId());
      var newlyCreatedFileParentIterator = spreadsheetFile.getParents();

      while (newlyCreatedFileParentIterator.hasNext()) {
        newlyCreatedFileParentIterator.next().removeFile(spreadsheetFile);
      }

      parentFolder.addFile(DriveApp.getFileById(newlyCreatedSpreadsheet.getId()));
      spreadsheet = newlyCreatedSpreadsheet;
      spreadsheet.appendRow(headers);
    } else {
      spreadsheet = SpreadsheetApp.open(spreadsheetIterator.next());
    }

    //noinspection JSCheckFunctionSignatures
    return {
      uuidColumnIndex: SheetUtility.getColumnIndexByName(spreadsheet.getSheets()[0],
                                                         GlobalConfig.uuidColumnKey),
      spreadsheet: spreadsheet,
    };
  },

  getParentFolderOfSpreadsheet: function (spreadsheet) {
    var parentFoldersIterator = DriveApp.getFileById(spreadsheet.getParent().getId()).getParents();
    if (!parentFoldersIterator.hasNext()) {
      throw 'Could not find parent folder for spreadsheet ' + spreadsheet.getName()
      + ', is it in a directory?';
    }

    var parentFolder = parentFoldersIterator.next();
    if (parentFoldersIterator.hasNext()) {
      throw 'Multiple parent folders found for spreadsheet '
      + spreadsheet.getName()
      + ', parent folder to use to create other spreadsheets could not be determined '
      + '(given there should only be one parent folder)';
    }

    return parentFolder;
  },
};
