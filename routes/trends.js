var express = require('express');
var router = express.Router();
// custom modules
var trends = require('../lib/trends');
trends.request();

router.get('/', function(req, res) {
  res.send(trends.stats);
})

module.exports = router;
