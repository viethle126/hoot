var twitterKey = process.env.TWITTER_CONSUMER_KEY;
var twitterSecret = process.env.TWITTER_CONSUMER_SECRET;
var token = process.env.TWITTER_ACCESS_TOKEN_KEY;
var secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

var _ = require('underscore');
var random = require('./utility/random');
var OAuth = require('OAuth');
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterKey,
  twitterSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

var trends = {};
trends.raw = {};
trends.list = [];
trends.stats = [];
trends.sum = 0;

trends.sort = function() {
  trends.list = [];
  trends.raw[0].trends.forEach(function(element, index, array) {
    trends.list.push(element);
  })
  trends.list = _.sortBy(trends.list, 'tweet_volume');
  return trends.list;
}

trends.calcSum = function() {
  sum = 0;
  trends.list.forEach(function(element, index, array) {
    sum += element.tweet_volume;
  })
  return sum;
}

trends.calcPercent = function(trend) {
  var percent = null;
  if (trend.tweet_volume !== null) {
    percent = Math.floor(trend.tweet_volume / sum * 100);
  }
  return percent;
}

trends.giveStats = function() {
  trends.stats = [];
  trends.calcSum();
  trends.list.forEach(function(element, index, array) {
    trends.stats.push({
      name: element.name,
      volume: element.tweet_volume,
      percent: trends.calcPercent(element)
    });
  })
  return trends.stats;
}

trends.request = function() {
  var promise = new Promise(function(resolve, reject) {
    console.log('Request for trending data started: ' + Date.now());
    oauth.get(
      'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      token,
      secret,
      function (error, data, response) {
        if (error) { reject(error) }
        resolve(data);
      }
    );
  })
  promise.then(function(data) {
    console.log('Request for trending data received: ' + Date.now());
    trends.raw = JSON.parse(data);
    trends.sort();
    trends.giveStats();
    random.begin(trends.stats);
  })
  .catch(function(error) {
    console.log(error);
  })
}

module.exports = trends;
