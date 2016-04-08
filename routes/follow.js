var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
// custom modules
var users = require('../data/users');

router.post('/list', jSonParser, function(req, res) {
  var user = req.body.me;
  var type = req.body.type;
  var youFollow = false;
  var payload = [];
  users[user][type].forEach(function(element, index, array) {
    youFollow = false;
    if (users[user].following.indexOf(element) !== -1) { youFollow = true }
    payload.push({
      name: users[element].name,
      handle: users[element].handle,
      tweets: users[element].tweets.length,
      followers: users[element].followers.length,
      following: users[element].following.length,
      follow: youFollow,
      me: user
    })
  })
  res.send(payload);
})

router.post('/follow', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.push(handle);
  users[handle].followers.push(me);
  res.send();
})

router.post('/unfollow', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.splice(users[me].following.indexOf(handle), 1);
  users[handle].followers.splice(users[handle].followers.indexOf(me), 1);
  res.send();
})

module.exports = router;
