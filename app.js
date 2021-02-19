var fs = require('fs'),
    http = require('http');
    mvc = require('./bipartite');

http.createServer(function (req, res) {
  fs.readFile(__dirname + "/dist" +req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080);
