var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
// custom modules
var users = require('../lib/users');

router.post('/add', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  var me = req.body.home;
  users[handle].tweets.forEach(function(element, index, array) {
    if (element.id === id && users[me].favorites.indexOf(element) === -1) {
      users[me].favorites.push(element);
      return;
    }
  })
  res.send();
})

router.post('/remove', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  users[handle].favorites.forEach(function(element, index, array) {
    if (element.id === id) {
      array.splice(index, 1);
      return;
    }
  })
  res.send();
})

module.exports = router;
