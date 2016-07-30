'use strict';

var Twitter = require('twitter');
var auth = require('../config/auth');
var twitterHelper, self;

twitterHelper = self = {
  tweet: function(req, res, next) {
    var client = new Twitter({
      consumer_key: auth.TWITTER_KEY,
      consumer_secret: auth.TWITTER_SECRET,
      access_token_key: auth.TWITTER_ACCESS_KEY,
      access_token_secret: auth.TWITTER_ACCESS_SECRET
    });
  }
};
