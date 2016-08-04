var Model = Model || {};

/**
 * Creates a new category specific spreadsheet object.
 *
 * @param spreadsheet
 * @param spreadsheetName
 * @param uuidColumnIndex
 *
 * @class
 * @classdesc This is a class to store data specifically about the a spreadsheet that is specific
 *            to a category.
 */
Model.CategorySpecificSpreadsheet = function (category, spreadsheet, spreadsheetName,
                                                uuidColumnIndex) {
  this.category = category;
  this.spreadsheet = spreadsheet;
  this.spreadsheetName = spreadsheetName;
  this.uuidColumnIndex = uuidColumnIndex;
};
