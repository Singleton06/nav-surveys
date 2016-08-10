var Model = Model || {};

/**
 * Constructs a new category specifically for categories for Greek Life Students.
 *
 * @param {String} categoryName
 *      The category name, used when identifying the category and even creating a spreadsheet
 *      for it.
 * @constructor
 */
Model.GreekCategory = function (categoryName) {

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
    var greekIndex = headers.indexOf('Greek');
    var greekValue = rowToMatch[greekIndex];

    var yearInSchoolIndex = headers.indexOf('Year in School');
    var yearInSchoolValue = rowToMatch[yearInSchoolIndex];

    return yearInSchoolValue != 'Freshman' && greekValue != 'no';
  };

  /**
   * The category name, used when identifying the category and even creating a spreadsheet
   * for it.
   *
   * @type {String}
   */
  this.categoryName = categoryName;
};
