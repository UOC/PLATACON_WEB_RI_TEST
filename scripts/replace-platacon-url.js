var fs = require('fs')
fs.readFile('./themes/uoc/static/admin/main.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/https:\/\/transfer-research.am.pre.uoc.es/g, process.env.PLATACON_API_URL);

  fs.writeFile('./themes/uoc/static/admin/main.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});