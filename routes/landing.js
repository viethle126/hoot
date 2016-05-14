var express = require('express');
var router = express.Router();
var _ = require('underscore');
var moment = require('moment');
moment().format();
// custom modules
var users = require('../lib/users');

router.get('/', function(req, res) {
  var payload = [];
  users.keys.forEach(function(element, index, array) {
    if (users[element].tweets) {
      users[element].tweets.forEach(function(element, index, array) {
        payload.push({
          name: element.name,
          id: element.id,
          handle: element.handle,
          image: users[element.handle].image,
          date: moment(element.date).fromNow(),
          content: element.content,
          picture: element.picture,
          sort: element.date
        })
      })
    }
  })
  payload = _.sortBy(payload, 'sort').reverse();
  payload = payload.slice(0, 150);
  res.send(payload);
})

router.get('/status', function(req, res) {
  if (req.cookies.user && users.keys.indexOf(req.cookies.user) !== -1) {
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
