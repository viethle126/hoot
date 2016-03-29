var express = require('express');
var jSonParser = require('body-parser').json();
var _ = require('underscore');
var app = express();
// custom modules
var users = require('./users.js');
var random = require('./random.js');
var id = random.begin(); // generate random tweets for all users, return id

function military(date) {
  var fixed = date;
  if (fixed[3] === '/') {
    fixed = fixed.slice(0, 2) + '0' + fixed.slice(2)
  }
  if (fixed[fixed.length - 7] === ' ') {
    fixed = fixed.slice(0, 10) + '0' + fixed.slice(fixed.length - 6);
  }
  if (fixed[fixed.length - 2] === 'a' && fixed[10] + fixed[11] === '12') {
    fixed = fixed.slice(0, 10) + '00' + fixed.slice(fixed.length - 5);
  }
  if (fixed[fixed.length - 2] === 'p' && fixed[10] + fixed[11] !== '12') {
    var military = String(Number(fixed.slice(10, 12)) + 12);
    fixed = fixed.slice(0, 10) + military + fixed.slice(fixed.length - 5);
  }
  return fixed;
}

function sendLine(handle, homeuser) {
  var tweets = [];
  users[handle].tweets.forEach(function(element, index, array) {
    var fixed = military(users[handle].tweets[index].date);
    tweets.push({
      name: users[handle].name,
      handle: users[handle].handle,
      date: users[handle].tweets[index].date,
      content: users[handle].tweets[index].content,
      sort: fixed
    })
  })
  if (homeuser === true) {
    users[handle].following.forEach(function(element, index, array) {
      var reference = users[element];
      console.log(reference.handle);
      reference.tweets.forEach(function(element, index, array) {
        var fixed = military(reference.tweets[index].date);
        tweets.push({
          name: reference.name,
          handle: reference.handle,
          date: reference.tweets[index].date,
          content: reference.tweets[index].content,
          sort: fixed
        })
      })
    })
  }
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}

app.post('/timeline', jSonParser, function(req, res) {
  res.send(sendLine(req.body.handle, req.body.home));
})

app.post('/card', jSonParser, function(req, res) {
  var user = req.body.handle;
  var me = req.body.home;
  var youFollow = false;
  if (users[user].followers.indexOf(me) !== -1) { youFollow = true }
  // use req.body.home to check follow status later
  var data = {
    name: users[user].name,
    handle: users[user].handle,
    tweets: users[user].tweets.length,
    followers: users[user].followers.length,
    following: users[user].following.length,
    follow: youFollow,
    me: me
  }
  res.send(data);
})

app.post('/follow', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.push(handle);
  res.send();
})

app.post('/unfollow', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.splice(users[me].following.indexOf(handle), 1);
  res.send();
})

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Connect to the server on http://localhost:8080');
  })
