var express = require('express');
var router = express.Router();
// custom modules
var trends = require('../data/trends');
trends.request();

router.get('/', function(req, res) {
  res.send(trends.stats);
})

module.exports = router;
