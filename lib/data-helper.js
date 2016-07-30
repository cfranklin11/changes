'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

dataHelper = self = {
  uploadData: function(req, res, next) {
    var parser, i, thisData, personaName, thisBudget, personaObject,
      personaArray, budgets, budgetLength, j, match, item;

    personaObject = {};
    personaArray = [];

    parser = parse({delimiter: ',', columns: true}, function(err, data){
      for (i = 0; i < data.length; i++) {

        thisData = data[i];
        personaName = thisData.name;
        thisBudget = {
          title: thisData.title,
          department: thisData.department,
          dollarsThisYear: thisData.dollarsThisYear,
          dollarsLastYear: thisData.dollarsLastYear,
          budgetPercent: thisData.budgetPercent,
          benefits: [thisData.benefits],
          clickRate: thisData.clickRate,
          clicks: thisData.clicks,
          impressions: thisData.impressions
        };

        if (personaObject[personaName]) {
          budgets = personaObject[personaName].budgets;
          budgetLength = budgets.length;

          for (j = 0; j < budgetLength; j++) {
            match = false;

            if (budgets[j].title === thisBudget.title) {
              personaObject[personaName].budgets[j].benefits.push(thisBudget.benefits[0]);
              match = true;
            }
          }

          if (!match) {
            personaObject[personaName].budgets.push(thisBudget);
          }

        } else {
          personaObject[personaName] = {
            name: personaName,
            budgets: [thisBudget]
          };
        }
      }

      for (item in personaObject) {
        personaArray.push(personaObject[item]);
      }
    });

    fs.createReadStream(__dirname + '/model-data2.csv').pipe(parser);
  }
};

module.exports = dataHelper;