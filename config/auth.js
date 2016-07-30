'use strict';

var fs = require('fs');
var env = {};
var envFile = __dirname + '/env.json';

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(function(key) {
    process.env[key] = env[key];
  });
}

module.exports = {
  TWITTER_KEY: process.env.TWITTER_KEY,
  TWITTER_SECRET: process.env.TWITTER_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET
};
