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

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data){
      var i, thisYear, max, min, maxMinDiff, lat, long, value, weight, yearData;

      if (err) {
        console.log(err);
        return res.send(err.toString());
      }

      var mapData = {
        years: []
      };

      // Iterate through data rows to get which years have data
      for (i = 0; i < data.length; i++) {
        var thisRow = data[i];
        var rowYear = thisRow.year;

        if (!mapData[rowYear]) {
          mapData.years.push(rowYear);
          mapData[rowYear] = [];
        }
      }

      var dataYears = mapData.years;

      // Iterate through years, creating year-specific arrays
      // with data for that year only
      for (i = 0; i < dataYears.length; i++) {
        thisYear = dataYears[i];

        max = Math.max.apply(Math, data.map(function(row) {
          if (row.year === thisYear) {
            return parseFloat(row[dataLabel]);
          }
        }));
        min = Math.min.apply(Math, data.map(function(row) {
          if (row.year === thisYear) {
            return parseFloat(row[dataLabel]);
          }
        }));
        maxMinDiff = max - min;

        yearData = data.filter(function(row) {
          return row.year === thisYear;
        });

        // Add year array to mapData object
        mapData[thisYear] = yearData.map(function(row) {
          lat = parseFloat(row.lat);
          long = parseFloat(row.long);
          value = parseFloat(row[dataLabel]);
          weight = (value - min) / maxMinDiff;

          return [lat, long, value];
        });
      }

      req.mapData = req.mapData || {};
      req.mapData[dataLabel] = mapData;

      next();
    });

    fs.createReadStream(__dirname + dataPath).pipe(parser);
  }
};

module.exports = dataHelper;