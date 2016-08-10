var Test = Test || {};

function runResidenceHallCategoryTest() {
  RunTests('ResidenceHallCategoryTest');
}

Test.ResidenceHallCategoryTest = (function () {
  var _testMatches = function () {
    var name = 'TestCategoryName';
    var residenceHalls = ['A Hall', 'B Hall'];

    var headers = ['Header1', 'Header2', 'Residence Hall', 'Header3'];
    var firstMatchingRow = ['val1', 'val2', residenceHalls[0], 'val3'];
    var secondMatchingRow = ['val1', 'val2', residenceHalls[0], 'val3'];
    var nonMatchingRow = ['val1', 'val2', 'val3', 'val4'];
    var wrongIndexRow = [residenceHalls[0], residenceHalls[0], 'val1', residenceHalls[0]];

    var residenceHallCategory = new Model.ResidenceHallCategory(name, residenceHalls);

    var firstMatchingRowResult = residenceHallCategory.matches(headers, firstMatchingRow);
    Assert.equal(firstMatchingRowResult, true);

    var secondMatchingRowResult = residenceHallCategory.matches(headers, secondMatchingRow);
    Assert.equal(secondMatchingRowResult, true);

    var nonMatchingRowResult = residenceHallCategory.matches(headers, nonMatchingRow);
    Assert.equal(nonMatchingRowResult, false);

    var wrongIndexRowResult = residenceHallCategory.matches(headers, wrongIndexRow);
    Assert.equal(wrongIndexRowResult, false);
  };

  return {
    testMatches: _testMatches
  };
})();
