var Model = Model || {};

Model.CategoryFactory = (function () {

  var _associateSpreadsheetsToAllCategories = function (categories, masterSheet) {
    var masterSheetHeaders = SheetUtility.getColumnTitlesAsArray(masterSheet);
    var categorySpecificHeaders =
      Utility.CategorySpecificSpreadsheetUtility.getCategorySpecificSpreadsheetHeaders(
        masterSheetHeaders);
    var parentFolder = SheetUtility.getParentFolderOfSpreadsheet(masterSheet.getParent());

    categories.forEach(function (element) {
      element.spreadsheet =
        Utility.CategorySpecificSpreadsheetUtility.retrieveCategorySpecificSpreadsheet(
          element.categoryName,
          parentFolder,
          categorySpecificHeaders);

    });

    // HIDE
    // Q - S
    // 17, 18, 19
    // Z - AC
    // 26, 27, 28, 29

  };

  var _createAllCategories = function () {
    var categories = [];
    categories.push(new Model.MarchingBandCategory('MarchingBand'));
    categories.push(new Model.GreekCategory('Greek'));
    categories.push(new Model.ResidenceHallCategory('Buchanan', ['Buchanan']));
    categories.push(new Model.ResidenceHallCategory('Eaton/Martin', ['Eaton', 'Martin']));
    categories.push(new Model.ResidenceHallCategory('Elm/Oak', ['Elm', 'Oak']));
    categories.push(new Model.ResidenceHallCategory('FreddyCourt', ['Freddy Court']));
    categories.push(new Model.ResidenceHallCategory('Friley', ['Friley']));
    categories.push(new Model.ResidenceHallCategory('Helser', ['Helser']));
    categories.push(new Model.ResidenceHallCategory('Larch', ['Larch']));
    categories.push(new Model.ResidenceHallCategory('Linden', ['Linden']));
    categories.push(new Model.ResidenceHallCategory('Maple', ['Maple']));
    categories.push(
      new Model.ResidenceHallCategory('OldRCA', ['Barton', 'Birch', 'Freeman', 'Lyon', 'Roberts',
        'Welch']));
    categories.push(new Model.ResidenceHallCategory('Wallace', ['Wallace']));
    categories.push(new Model.ResidenceHallCategory('Willow', ['Willow']));
    categories.push(new Model.ResidenceHallCategory('Wilson', ['Wilson']));
    categories.push(new Model.ResidenceHallCategory('CityOfAmes', ['Off campus']));

    return categories;
  };

  return {
    createAllCategories: _createAllCategories,
    associateSpreadsheetsToAllCategories: _associateSpreadsheetsToAllCategories
  };
})();
