'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

var TEMP_PATH = '/dummy-temp-data.csv';
var PRECIP_PATH = '/dummy-precipitation-data.csv';

dataHelper = self = {
  getTempData: function(req, res, next) {
    self.getData(req, res, next, TEMP_PATH, 'temperature');
  },

  getPrecipData: function(req, res, next) {
    self.getData(req, res, next, PRECIP_PATH, 'precipitation');
  },

  getData: function(req, res, next, dataPath, dataLabel) {
    var parser;

    parser = parse({delimiter: ',', columns: true}, function(err, data){
      if (err) {
        console.log(err);
        return res.send(err.toString());
      }

      var max = Math.max.apply(Math, data.map(function(row) {
        return parseFloat(row[dataLabel]);
      }));
      var min = Math.min.apply(Math, data.map(function(row) {
        return parseFloat(row[dataLabel]);
      }));
      var maxMinDiff = max - min;

      var mapData = data.map(function(row) {
        var lat = parseFloat(row.lat);
        var long = parseFloat(row.long);
        var value = (parseFloat(row[dataLabel]) - min) / maxMinDiff;
        return [lat, long, value];
      })

      req.mapData = req.mapData || {};
      req.mapData[dataLabel] = mapData;

      next();
    });

    fs.createReadStream(__dirname + dataPath).pipe(parser);
  }
};

module.exports = dataHelper;