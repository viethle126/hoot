var express = require('express');
var router = express.Router();
var _ = require('underscore');
// custom modules
var users = require('../data/users');
var timestamp = require('../data/utility/timestamp');

router.get('/', function(req, res) {
  var payload = [];
  users.keys.forEach(function(element, index, array) {
    if (users[element].tweets) {
      users[element].tweets.forEach(function(element, index, array) {
        var fixed = timestamp.military(element.date);
        payload.push({
          name: element.name,
          id: element.id,
          handle: element.handle,
          date: element.date,
          content: element.content,
          sort: fixed,
        })
      })
    }
  })
  payload = _.sortBy(payload, 'sort').reverse();
  payload = payload.slice(0, 30);
  res.send(payload);
})

router.get('/status', function(req, res) {
  if (req.cookies.user) {
    var user = req.cookies.user;
    var cookie = req.cookies.session;
    if (users[user].cookies.indexOf(cookie) !== -1) {
      res.sendStatus(240);
    } else {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(200);
  }
})

module.exports = router;
