var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
// custom modules
var users = require('../data/users');

router.post('/', jSonParser, function(req, res) {
  var user = req.body.user;
  var data = {
    alerts: users[user].alerts
  }
  res.send(data);
})

router.post('/clear', jSonParser, function(req, res) {
  var user = req.body.user;
  users[user].alerts = 0;
  var data = {
    alerts: users[user].alerts
  }
  res.send(data);
})

module.exports = router;
