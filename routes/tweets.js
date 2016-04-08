var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
// custom modules
var users = require('../data/users');
var parse = require('../data/utility/parse');
var timestamp = require('../data/utility/timestamp');

function addMentions(mentions, tweet) {
  mentions.forEach(function(element, index, array) {
    users[element].notifications.push(tweet);
  })
}

router.post('/addTweet', verify, jSonParser, function(req, res) {
  users.id++
  var handle = req.body.handle;
  var content = req.body.content;
  var tweet = {
    name: users[handle].name,
    handle: handle,
    id: users.id,
    date: timestamp.civilian(),
    content: content,
    mentions: parse.users(content),
    retweet: 'None'
  }
  addMentions(tweet.mentions, tweet);
  users[handle].tweets.push(tweet);
  res.send();
})

router.post('/addRetweet', verify, jSonParser, function(req, res) {
  users.id++
  var retweet = {};
  var retweetId = Number(req.body.retweetId);
  var retweetHandle = req.body.retweetHandle;
  users[retweetHandle].tweets.forEach(function(element, index, array) {
    if (element.id === retweetId) {
      retweet = element;
      return;
    }
  })
  var handle = req.body.handle;
  var content = req.body.content;
  var tweet = {
    name: users[handle].name,
    handle: handle,
    id: users.id,
    date: timestamp.civilian(),
    content: content,
    mentions: parse.users(content),
    retweet: retweet
  }
  addMentions(tweet.mentions, tweet);
  users[handle].tweets.push(tweet);
  res.send();
})

router.post('/getRetweet', verify, jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  var payload = {};
  users[handle].tweets.forEach(function(element, index, array) {
    if (element.id === id) { payload = element }
  })
  res.send(payload);
})

module.exports = router;