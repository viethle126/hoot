var twitterKey = process.env.TWITTER_CONSUMER_KEY;
var twitterSecret = process.env.TWITTER_CONSUMER_SECRET;
var token = process.env.TWITTER_ACCESS_TOKEN_KEY;
var secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

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
trends.data = {};

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
    trends.data = JSON.parse(data);
    console.log('Request for trending data received: ' + Date.now());
  })
  .catch(function(error) {
    console.log('Error encountered: ' + Date.now());
    console.log(error);
  })
}

trends.list = function() {
  return JSON.stringify(trends.data, 0, 2);
}

module.exports = trends;
