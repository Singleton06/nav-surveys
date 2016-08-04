var Assert = {
  equal: function (val1, val2) {
    if (Assert.isValueOfTypeArray(val1) && Assert.isValueOfTypeArray(val2)) {
      if (Assert.areArraysEqual(val1, val2)) {
        return;
      }

      throw this.debugMessageBuilder(val1, val2);
    }

    if (val1 !== val2) {
      throw this.debugMessageBuilder(val1, val2);
    }
  },

  debugMessageBuilder: function (val1, val2) {
    var debugMessage = val1 + ' was not equal to ' + val2;
    debugMessage += '\r\nval1 typeof: ' + typeof val1;
    debugMessage += '\r\nval2 typeof: ' + typeof val2;
    return debugMessage;
  },

  isValueOfTypeArray: function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },

  areArraysEqual: function (arr1, arr2) {
    if (!arr1 || !arr2) {
      return false;
    }

    if (arr1.length != arr2.length) {
      return false;
    }

    if (arr1.length === 0 && arr2.length === 0) {
      return true;
    }

    for (var i = 0; i < arr1.length; i++) {
      // Check if we have nested arrays
      if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this.areArraysEqual(arr1[i], arr2[i])) {
          return false;
        }
      } else if (arr1[i] != arr2[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }

    return true;
  },
};
