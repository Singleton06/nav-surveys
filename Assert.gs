var Assert = {
  equal: function (val1, val2) {
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
};
