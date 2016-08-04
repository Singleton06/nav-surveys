function RunTests() {
  if (!Test) {
    Utility.Logger.log('No Tests were ran because Test is undefined');
  }

  Utility.Logger.log('TEST RUNS:');
  for (var testClass in Test) {
    Utility.Logger.log('');
    Utility.Logger.log('Class: ' + testClass);

    for (var singleTest in Test[testClass]) {
      if (!Test[testClass].hasOwnProperty(singleTest)) {
        continue;
      }

      // if it is a function and it starts with the word test, we want to run it
      if (typeof Test[testClass][singleTest] === 'function' && singleTest.indexOf('test') === 0) {
        Test[testClass][singleTest]();
        Utility.Logger.log(singleTest + ' PASSED!');
      }
    }
  }

  Utility.Logger.log('Finished test runs');
};
