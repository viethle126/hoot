var express = require('express');
var jSonParser = require('body-parser').json();
var _ = require('underscore');
var app = express();
// custom modules
var users = require('./users.js');
var random = require('./random.js');
// generate random hoots for all users, return id count
var id = random.begin();
// convert time to military format for sorting purposes
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
// format Date() for new hoots
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
// return an array of hoots
function sendLine(handle, homeuser, type) {
  var tweets = [];
  var user = handle;
  var whichUser = user;
  var type = type;
  if (type === 'favorites') { whichUser = 'viethle126' }
  users[whichUser][type].forEach(function(element, index, array) {
    var fixed = military(element.date);
    var fav = (users[whichUser].favorites.indexOf(element));
    if (fav !== -1) { fav = true }
    tweets.push({
      name: element.name,
      id: element.id,
      handle: element.handle,
      date: element.date,
      content: element.content,
      sort: fixed,
      fav: fav
    })
  })
  if (homeuser === true) {
    users[whichUser].following.forEach(function(element, index, array) {
      users[element].tweets.forEach(function(element, index, array) {
        var fixed = military(element.date);
        var fav = (users[whichUser].favorites.indexOf(element));
        if (fav !== -1) { fav = true }
        tweets.push({
          name: element.name,
          id: element.id,
          handle: element.handle,
          date: element.date,
          content: element.content,
          sort: fixed,
          fav: fav
        })
      })
    })
  }
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}

app.post('/timeline', jSonParser, function(req, res) {
  res.send(sendLine(req.body.handle, req.body.home, req.body.type));
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

app.post('/removeFavorite', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  users[handle].favorites.forEach(function(element, index, array) {
    if (element.id === id) {
      array.splice(index);
      return;
    }
  })
  res.send();
})

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Connect to the server on http://localhost:8080');
})
