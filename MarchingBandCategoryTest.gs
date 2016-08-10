var Test = Test || {};

function runMarchingBandCategoryTest() {
  RunTests('MarchingBandCategoryTest');
}

Test.MarchingBandCategoryTest = (function () {
  var _testMatches = function () {
    var name = 'MarchingBandCategoryName';

    var headers = ['Band', 'Header2', 'Residence Hall', 'Year in School'];
    var band = ['yes', 'val1', 'Hall', 'Sophomore'];
    var nonBand = ['no', 'val1', 'Hall', 'Senior'];
    var wrongIndexBand = ['val1', 'no', 'Hall', 'Senior'];

    var GreekCategory = new Model.GreekCategory(name);

    var bandResult = GreekCategory.matches(headers, band);
    Assert.equal(bandResult, true);

    var nonBandResult = GreekCategory.matches(headers, nonBand);
    Assert.equal(nonBandResult, false);

    var wrongIndexBandResult = GreekCategory.matches(headers, wrongIndexBand);
    Assert.equal(wrongIndexBandResult, false);
  };

  return {
    testMatches: _testMatches
  };
})();
