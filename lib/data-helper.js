'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

var DATA_PATH = '/changes-test-data.csv';

dataHelper = self = {
  getData: function(req, res, next) {
    var parser;

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data){
      var key, i, thisYear, max, min, maxMinDiff, lat, long, value, weight,
        yearData, thisRow, rowYear, thisRowData, yearArray;

      if (err) {
        console.log(err);
        return res.send(err.toString());
      }

      var mapData = {};
      var yearArray = [];
      var categoryArray = [];
      var labelRow = data[0];

      for (key in labelRow) {
        if (!/longitude|latitude|statecode|LGA|YEAR/i.test(key)) {
          mapData[key] = {
            years: []
          };
          categoryArray.push(key);
        }
      }

      // Iterate through data rows to get which years have data
      for (i = 0; i < data.length; i++) {
        thisRow = data[i];
        rowYear = thisRow.year;
        // thisRowData = {
        //   lat: thisRow.latitude,
        //   long: thisRow.longitude,
        //   value: thisRow[key]
        // };

        for (key in mapData) {
          thisYearData = mapData[key][rowYear]

          if (!thisYearData) {
            mapData[key][rowYear] = [];
            mapData[key]['years'].push(rowYear);

            if (yearArray.indexOf(rowYear) === -1) {
              yearArray.push(rowYear);
            }
          }
        }
      }

      // Iterate through years, creating year-specific arrays
      // with data for that year only
      for (i = 0; i < yearArray.length; i++) {
        thisYear = yearArray[i];

        for (key in mapData) {
          thisData = mapData[key];

          max = Math.max.apply(Math, data.map(function(row) {
            if (row.year === thisYear) {
              return parseFloat(row[key]);
            }
          }));
          min = Math.min.apply(Math, data.map(function(row) {
            if (row.year === thisYear) {
              return parseFloat(row[key]);
            }
          }));
          maxMinDiff = max - min;

          yearData = data.filter(function(row) {
            return row.year === thisYear;
          });

          // Add year array to mapData object
          mapData[key][thisYear] = yearData.map(function(row) {
            lat = parseFloat(row.latitude);
            long = parseFloat(row.longitude);
            value = parseFloat(row[key]);
            weight = (value - min) / maxMinDiff;

            return [lat, long, value];
          });
        }
      }

      req.mapData = mapData;
      req.mapData.categories = categoryArray;

      next();
    });

    fs.createReadStream(__dirname + dataPath).pipe(parser);
  }
};

module.exports = dataHelper;