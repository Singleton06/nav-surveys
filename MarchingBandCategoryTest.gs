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

    var marchingBandCategory = new Model.MarchingBandCategory(name);

    var bandResult = marchingBandCategory.matches(headers, band);
    Assert.equal(bandResult, true);

    var nonBandResult = marchingBandCategory.matches(headers, nonBand);
    Assert.equal(nonBandResult, false);

    var wrongIndexBandResult = marchingBandCategory.matches(headers, wrongIndexBand);
    Assert.equal(wrongIndexBandResult, false);
  };

  return {
    testMatches: _testMatches
  };
})();
