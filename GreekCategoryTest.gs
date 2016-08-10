var Test = Test || {};

function runGreekCategoryTest() {
  RunTests('GreekCategoryTest');
}

Test.GreekCategoryTest = (function () {
  var _testMatches = function () {
    var name = 'GreekCategoryName';

    var headers = ['Greek', 'Header2', 'Residence Hall', 'Year in School'];
    var greekSophomore = ['Greek1', 'val1', 'Hall', 'Sophomore'];
    var greekSenior = ['Greek1', 'val1', 'Hall', 'Senior'];
    var greekFreshman = ['Greek1', 'val1', 'Hall', 'Freshman'];
    var nonGreekSophomore = ['no', 'val1', 'Hall', 'Sophomore'];
    var nonGreekFreshman = ['no', 'val1', 'Hall', 'Freshman'];

    var GreekCategory = new Model.GreekCategory(name);

    var matchingValueResult = GreekCategory.matches(headers, greekSophomore);
    Assert.equal(matchingValueResult, true);

    var nonMatchingFreshmanResult = GreekCategory.matches(headers, greekFreshman);
    Assert.equal(nonMatchingFreshmanResult, false);

    var nonGreekSophomoreResult = GreekCategory.matches(headers, nonGreekSophomore);
    Assert.equal(nonGreekSophomoreResult, false);

    var nonGreekFreshmanResult = GreekCategory.matches(headers, nonGreekFreshman);
    Assert.equal(nonGreekFreshmanResult, false);

    var greekSeniorResult = GreekCategory.matches(headers, greekSenior);
    Assert.equal(greekSeniorResult, true);
  };

  return {
    testMatches: _testMatches
  };
})();
