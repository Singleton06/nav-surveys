var Test = Test || {};

function runSpreadsheetSplitterTest() {
  RunTests('ExportedColumnPopulatorTest');
}

Test.ExportedColumnPopulatorTest = (function () {

  var spreadsheetTemplateFile =
    DriveApp.getFileById('1HFDyTRROx-NLjAn94AoKNVS-hAc-WQmnIXDf8TNewM8');
  var testFolder = DriveApp.getFolderById('0B-yIe9XImt25Nnc1d1dRdi1kQUk');

  /**
   * Creates a copy of the file in the test directory and then translates it into a spreadsheet
   * object.
   *
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} the copied spreadsheet.
   * @private
   */
  var _copyTemplate = function (name) {
    var copiedFile = spreadsheetTemplateFile.makeCopy(name, testFolder);
    return SpreadsheetApp.openById(copiedFile.getId());
  };

  var _testPopulateExportedColumnNoDataChanged = function () {
    var copiedTemplate = _copyTemplate('testPopulateExportedColumn-spreadsheet');
    var sheet = copiedTemplate.getSheetByName('NoDataExported');
    var unchangedValues = sheet.getDataRange().getValues();

    var mockMasterSheet = { lastProcessedRowIndex: -1 };
    var mockProcessedMasterSheet = new Model.ProcessedMasterSheet({}, [], -1, mockMasterSheet);

    try {
      DataProcessing.ExportedColumnPopulator.populateExportedColumn(mockProcessedMasterSheet);

      Assert.equal(sheet.getDataRange().getValues(), unchangedValues);
    }
    finally {
      DriveApp.getFileById(copiedTemplate.getId()).setTrashed(true);
    }
  };

  var _testPopulateExportedColumnNoRowsExported = function () {
    var copiedTemplate = _copyTemplate('testPopulateExportedColumnNoRowsExported-spreadsheet');
    var sheet = copiedTemplate.getSheetByName('NoDataExported');
    var expectedData = [['Header1', 'Exported'],
                        ['1', true],
                        ['2', true],
                        ['3', true]];

    var mockMasterSheet = { exportedColumnIndex: 1, sheet: sheet };
    var mockProcessedMasterSheet = new Model.ProcessedMasterSheet({}, [], 3, mockMasterSheet);

    try {
      DataProcessing.ExportedColumnPopulator.populateExportedColumn(mockProcessedMasterSheet);

      Assert.equal(sheet.getDataRange().getValues(), expectedData);
    }
    finally {
      DriveApp.getFileById(copiedTemplate.getId()).setTrashed(true);
    }
  };

  var _testPopulateExportedPartialDataExported = function () {
    var copiedTemplate = _copyTemplate('testPopulateExportedColumnPartialDataExported-spreadsheet');
    var sheet = copiedTemplate.getSheetByName('PartialDataExported');
    var expectedData = [['Header1', 'Exported'],
      ['1', true],
      ['2', true],
      ['3', true]];

    var mockMasterSheet = { exportedColumnIndex: 1, sheet: sheet };
    var mockProcessedMasterSheet = new Model.ProcessedMasterSheet({}, [], 3, mockMasterSheet);

    try {
      DataProcessing.ExportedColumnPopulator.populateExportedColumn(mockProcessedMasterSheet);

      Assert.equal(sheet.getDataRange().getValues(), expectedData);
    }
    finally {
      DriveApp.getFileById(copiedTemplate.getId()).setTrashed(true);
    }
  };

  var _testPopulateExportedSingleRowNotExported = function () {
    var copiedTemplate = _copyTemplate('testPopulateExportedColumnPartialDataExported-spreadsheet');
    var sheet = copiedTemplate.getSheetByName('SingleRowNotExported');
    var expectedData = [['Header1', 'Header2', 'Exported'],
                        ['1', '2', true]];

    var mockMasterSheet = { exportedColumnIndex: 2, sheet: sheet };
    var mockProcessedMasterSheet = new Model.ProcessedMasterSheet({}, [], 1, mockMasterSheet);

    try {
      DataProcessing.ExportedColumnPopulator.populateExportedColumn(mockProcessedMasterSheet);

      Assert.equal(sheet.getDataRange().getValues(), expectedData);
    }
    finally {
      DriveApp.getFileById(copiedTemplate.getId()).setTrashed(true);
    }
  };

  return {
    testPopulateExportedColumnNoDataChanged: _testPopulateExportedColumnNoDataChanged,
    testPopulateExportedColumnNoRowsExported: _testPopulateExportedColumnNoRowsExported,
    testPopulateExportedPartialDataExported: _testPopulateExportedPartialDataExported,
    testPopulateExportedSingleRowNotExported: _testPopulateExportedSingleRowNotExported
  };
})();
