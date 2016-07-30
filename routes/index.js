'use strict';

var express = require('express');
var router = express.Router();
var dataHelper = require('../lib/data-helper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/data',
  dataHelper.getData,
  function(req, res, next) {
  res.render('index', { title: 'Data' });
});

module.exports = router;
