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

function format() {
  var now = Date();
  var month = '';
  var hours = now.slice(16, 18);
  var min = now.slice(19, 21);
  var ampm = '';
  var day = now.slice(8, 10);
  if (now.slice(4, 7) === 'Mar') { month = 3 }
  if (now.slice(4, 7) + now[6] === 'Apr') { month = 4 }
  if (hours < 12) { ampm = 'am' }
  if (hours >= 12) { ampm = 'pm' }
  if (hours > 12) { hours -= 12 }
  if (hours == '00') { hours = 12 }
  var fixed = month + '/' + day + '/2016 ' + hours + ':' + min + ampm;
  return fixed;
}

function sendLine(handle, homeuser) {
  var tweets = [];
  users[handle].tweets.forEach(function(element, index, array) {
    var fixed = military(users[handle].tweets[index].date);
    tweets.push({
      name: users[handle].name,
      id: users[handle].tweets[index].id,
      handle: users[handle].handle,
      date: users[handle].tweets[index].date,
      content: users[handle].tweets[index].content,
      sort: fixed
    })
  })
  if (homeuser === true) {
    users[handle].following.forEach(function(element, index, array) {
      var reference = users[element];
      reference.tweets.forEach(function(element, index, array) {
        var fixed = military(reference.tweets[index].date);
        tweets.push({
          name: reference.name,
          id: reference.tweets[index].id,
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
  users[handle].followers.push(me);
  res.send();
})

app.post('/unfollow', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.splice(users[me].following.indexOf(handle), 1);
  users[handle].followers.splice(users[handle].followers.indexOf(me), 1);
  res.send();
})

app.post('/hoot', jSonParser, function(req, res) {
  id++
  var handle = req.body.handle;
  var content = req.body.content;
  users[handle].tweets.push({
    user: users[handle].name,
    id: id,
    date: format(),
    content: content,
    tags: [],
    mentions: [],
    retweet: []
  })
  res.send();
})

app.post('/addFavorite', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = req.body.id;
  var me = req.body.me;
  var hoot = {};
  users[handle].tweets.forEach(function(element, index, array) {
    if (element.id === id) {
      users[me].favorites.push(element);
      return;
    }
  })
  app.send();
})

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Connect to the server on http://localhost:8080');
})
