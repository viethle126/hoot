var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
// custom modules
var users = require('../data/users');

// recommend users most commonly followed by your followers
function recommend(who) {
  var total = [];
  var unique = [];
  var sorted = [];
  users[who].following.forEach(function(element, index, array) {
    users[element].following.forEach(function(element, index, array) {
      if (element !== who) { total.push(element) }
      if (unique.indexOf(element) === -1) {
        if (users[who].following.indexOf(element) === -1 && element !== who) {
          unique.push(element);
        }
      }
    })
  })
  sorted = findAffinity(total, unique, sorted);
  sorted = _.sortBy(sorted, 'count');
  return sorted;
}
// determine suggestion score
function findAffinity(total, unique, sorted) {
  unique.forEach(function(element, index, array) {
    var count = countDupes(element, total, 0);
    var user = {
      handle: element,
      count: count
    }
    sorted.push(user);
  })
  return sorted;
}
// count duplicates in an array
function countDupes(element, array, count) {
  if (array.indexOf(element) !== -1) {
    count++;
    array.splice(array.indexOf(element), 1);
    return countDupes(element, array, count);
  } else {
    return count;
  }
}

router.post('/', jSonParser, function(req, res) {
  res.send(suggest(req.body.user));
})

module.exports = router;
