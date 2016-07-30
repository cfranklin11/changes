'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

var DATA_PATH = __dirname + '/dummy-data.csv';

dataHelper = self = {
  getData: function(req, res, next) {
    var parser;

    parser = parse({delimiter: ',', columns: true}, function(err, data){
      if (err) {
        console.log(err);
        return res.send(err.toString());
      }

      console.log(data);
      next();
    });

    fs.createReadStream(DATA_PATH).pipe(parser);
  }
};

module.exports = dataHelper;