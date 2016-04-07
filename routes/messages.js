var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
var convo = require('../data/convo');
var users = require('../data/users');

function check(who) {
  var error = false;
  who.forEach(function(element, index, array) {
    if (users.check(element) === false) {
      error = true;
    }
  })
  return error;
}

router.post('/new', jSonParser, function(req, res) {
  if (check(req.body.users) === true) {
    res.sendStatus(208);
  } else {
    convo.new(req.body.users);
    var data = {
      id: convo.id() - 1
    }
    res.send(data);
  }
})

router.post('/invite', jSonParser, function(req, res) {
  if (check(req.body.users) === true) {
    res.sendStatus(208);
  } else {
    req.body.users.forEach(function(element, index, array) {
      convo.invite(element, req.body.id);
    })
    res.send();
  }
})

router.post('/leave', jSonParser, function(req, res) {
  convo.leave(req.body.users, req.body.id);
  res.send();
})

router.post('/list', jSonParser, function(req, res) {
  res.send(convo.list(req.body.user));
})

router.post('/get', jSonParser, function(req, res) {
  res.send(convo.get(Number(req.body.id)));
})

router.post('/send', jSonParser, function(req, res) {
  convo.send(req.body);
  res.send();
})

module.exports = router;
