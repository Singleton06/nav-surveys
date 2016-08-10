var Model = Model || {};

/**
 * Constructs a new category specifically for categories based off of the residence hall.
 *
 * @param {String} categoryName
 *      The category name, used when identifying the category and even creating a spreadsheet
 *      for it.
 * @param {String[]} residenceHallNames
 *      The different names of the residence halls that this specific category will match to.
 *      This could be a single value or multiple values.
 * @constructor
 */
Model.ResidenceHallCategory = function (categoryName, residenceHallNames) {

  /**
   * Determines whether or not the current entry matches the specified value.
   *
   * @param {String[]} headers
   *    The headers, which will help to associate the values in the rowToMatch parameter with the
   *    meaning of the values.  Basically, the 0th value in the headers would match the 0th value
   *    in the rowToMatch.
   * @param rowToMatch
   *    The row that the current match is being performed on.  This value and the corresponding
   *    header should be checked to determined if the value matches.
   *
   * @return {boolean} true if the entry in the rowToMatch parameter should be included in this
   *    category, false otherwise.
   */
  this.matches = function (headers, rowToMatch) {
    var residenceHallIndex = headers.indexOf('Residence Hall');
    var residenceHallValue = rowToMatch[residenceHallIndex];

    return this.residenceHallNames.indexOf(residenceHallValue) !== -1;
  };

  /**
   * The category name, used when identifying the category and even creating a spreadsheet
   * for it.
   *
   * @type {String}
   */
  this.categoryName = categoryName;

  /**
   *  The different names of the residence halls that this specific category will match to. This
   * could be a single value or multiple values.
   *
   * @type {String[]}
   */
  this.residenceHallNames = residenceHallNames;
};
