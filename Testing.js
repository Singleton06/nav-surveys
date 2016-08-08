console.log('testing');
[[]].forEach(function (item, index)
{
  console.log(item + ' ' + index);
});

var dataToExport = [['Header1', 'UUID', 'Hall'],
  ['col1Value1', 'col2Value1', 'a'],
  ['col1Value2', 'col2Value2', 'a']];
var headers = dataToExport[0];
var allData = [dataToExport[1], dataToExport[2]];

console.log(headers);
console.log(allData);
