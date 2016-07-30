'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

var TEMP_PATH = '/dummy-temp-data.csv';
var PRECIP_PATH = '/dummy-precipitation-data.csv';

dataHelper = self = {
  getTempData: function(req, res, next) {
    self.getData(req, res, next, TEMP_PATH);
  },

  getPrecipData: function(req, res, next) {
    self.getData(req, res, next, PRECIP_PATH);
  },

  getData: function(req, res, next, dataPath) {
    var parser;

    parser = parse({delimiter: ',', columns: true}, function(err, data){
      if (err) {
        console.log(err);
        return res.send(err.toString());
      }

      console.log(data);
      next();
    });

    fs.createReadStream(__dirname + dataPath).pipe(parser);
  }
};

module.exports = dataHelper;