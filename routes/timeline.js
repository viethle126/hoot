var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
var _ = require('underscore');
// custom modules
var users = require('../data/users');
var parse = require('../data/utility/parse');
var timestamp = require('../data/utility/timestamp');

// return an array of tweets
function timeline(user, me, type) {
  var tweets = [];
  switch(type) {
    case 'favorites':
    users[me].favorites.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    case 'notifications':
    users[me].notifications.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    case 'home': // push followers' tweets, continue to next case
    users[me].following.forEach(function(element, index, array) {
      users[element].tweets.forEach(function(element, index, array) {
        tweets.push(prepare(me, element));
      })
    })
    case 'tweets': // push user's tweets
    users[user].tweets.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    default:
    break;
  }
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}
// prepare tweet
function prepare(home, tweet) {
  var retweet = 'None';
  if (tweet.retweet.id) {
    retweet = prepare(home, tweet.retweet)
  }
  return {
    name: tweet.name,
    id: tweet.id,
    handle: tweet.handle,
    image: users[tweet.handle].image,
    date: tweet.date,
    content: tweet.content,
    sort: timestamp.military(tweet.date),
    fav: checkFav(home, tweet),
    retweet: retweet,
  }
}
// check favorite
function checkFav(home, tweet) {
  if (users[home].favorites.indexOf(tweet) !== -1) {
    return true;
  } else {
    return false;
  }
}
// search for tweets by string or user
function search(input, home) {
  var byUser = [];
  var byString = [];
  var handles = parse.users(input);
  var string = parse.string(input);
  if (string === '') { string = 'foobar' }
  var reg = new RegExp('(' + string + ')');
  handles.forEach(function(element, index, array) {
    if (users[element]) {
      byUser = byUser.concat(timeline(element, home, 'tweets'));
      return byUser;
    }
  })
  users.keys.forEach(function(element, index, array) {
    users[element].tweets.forEach(function(element, index, array) {
      if (element.content.toLowerCase().search(reg) !== -1) {
        byString.push(prepare(home, element));
      }
    })
  })
  byUser = _.sortBy(byUser, 'sort').reverse();
  byString = _.sortBy(byString, 'sort').reverse();
  return { byUser: byUser, byString: byString }
}

router.post('/', jSonParser, function(req, res) {
  res.send(timeline(req.body.handle, req.body.home, req.body.type));
})

router.post('/search', jSonParser, function(req, res) {
  res.send(search(req.body.search, req.body.home));
})

module.exports = router;
