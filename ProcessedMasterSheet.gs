var Model = Model || {};

/**
 * Constructs a new processed master sheet object, which will contain all information needed to
 * understand the master sheet, the categories of data that it contains (which need to be
 * exported), etc.
 *
 * @param {Object} categorySpecificSpreadsheets the object containing the
 *   CategorySpecificSpreadsheet objects, where the property name is the category identifier.
 * @param {String[]} categories an array of all categories contained in the
 *                              categorySpecificSpreadsheets object.
 * @param {Number} lastProcessedRowIndex the last row of the master sheet that was processed.  This
 *   will help to determine just how far the processing occurred within the master sheet given that
 *   at any time an additional entry could be added.  This value will be 0 based.  If there
 *   were no rows that were processed, this value should be set to -1.
 * @param {Model.MasterSheet} masterSheet the reference to the master sheet that
 *   all of the other fields were populated from.
 *
 * @see {@link Model.CategorySpecificSpreadsheet}
 * @constructor
 */
Model.ProcessedMasterSheet = function (categorySpecificSpreadsheets, categories,
                                       lastProcessedRowIndex, masterSheet) {
  this.categorySpecificSpreadsheets = categorySpecificSpreadsheets;
  this.lastProcessedRowIndex = lastProcessedRowIndex;
  this.categories = categories;
  this.masterSheet = masterSheet;
};
