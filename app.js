var express = require('express');
var jSonParser = require('body-parser').json();
var _ = require('underscore');
var app = express();

var users = require('./users.js');
var random = require('./random.js');
random.begin(); // generate random tweets for all users

function sendLine(handle) {
  var tweets = [];
  users[handle].tweets.forEach(function(element, index, array) {
    var fixed = users[handle].tweets[index].date;
    if (fixed[3] === '/') { fixed = fixed.slice(0, 2) + '0' + fixed.slice(2) }
    tweets.push({
      name: users[handle].name,
      handle: users[handle].handle,
      date: users[handle].tweets[index].date,
      content: users[handle].tweets[index].content,
      sort: fixed
    })
  })
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}

app.post('/timeline', jSonParser, function(req, res) {
  res.send(sendLine(req.body.handle));
});

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Connect to the server on http://localhost:8080');
  })
