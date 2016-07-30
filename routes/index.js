'use strict';

var express = require('express');
var router = express.Router();
var dataHelper = require('../lib/data-helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/data', function(req, res, next) {
  res.render('data', {title: 'Data'});
});
router.get('/api/data',
  dataHelper.getTempData,
  dataHelper.getPrecipData,
  function(req, res, next) {
    res.json(req.mapData);
});

module.exports = router;
