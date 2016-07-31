'use strict';

var express = require('express');
var router = express.Router();
var dataHelper = require('../lib/data-helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Climate Change', categories: ['temperature', 'precipitation'] });
});
router.get('/data', function(req, res, next) {
  res.render('data', {title: 'Data'});
});
router.get('/api/data',
  dataHelper.getData,
  function(req, res, next) {
    res.json(req.mapData);
});

module.exports = router;
