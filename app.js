var express = require('express');
var jSonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
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
  if (now.slice(4, 7) === 'Apr') { month = 4 }
  if (hours < 12) { ampm = 'am' }
  if (hours >= 12) { ampm = 'pm' }
  if (hours > 12) { hours -= 12 }
  if (hours == '00') { hours = 12 }
  var fixed = month + '/' + day + '/2016 ' + hours + ':' + min + ampm;
  return fixed;
}
// add string to cookie
function extendCookie(count, cookie) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var pick = Math.floor(Math.random() * 60) + 1;

  if (count > 0) {
    cookie+= chars[pick];
    count--;
    return extendCookie(count, cookie);
  } else {
    return cookie;
  }
}
// generate cookie value
function makeCookie() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var pick = Math.floor(Math.random() * 60) + 1;
  var cookie = chars[pick];
  cookie = extendCookie(40, cookie);
  return cookie;
}
// log in
function login(user, password) {
  if (users[user]) {
    if (users[user].password === password) {
      return 200;
    } else {
      return 403;
    }
  } else {
    return 403;
  }
}
// return an array of hoots NOTE need to refactor later
function sendLine(handle, homeuser, type) {
  var tweets = [];
  var user = handle;
  var home = homeuser;
  var whichUser = user;
  var type = type;
  if (type === 'favorites') { whichUser = home }
  users[whichUser][type].forEach(function(element, index, array) {
    var fixed = military(element.date);
    var fav = (users[home].favorites.indexOf(element));
    if (fav !== -1) { fav = true }
    var retweet = 'None';
    if (element.retweet.id) { retweet = element.retweet }
    tweets.push({
      name: element.name,
      id: element.id,
      handle: element.handle,
      date: element.date,
      content: element.content,
      sort: fixed,
      fav: fav,
      retweet: retweet
    })
  })
  if (type === 'notifications') { homeuser = null }
  if (homeuser === user) {
    users[whichUser].following.forEach(function(element, index, array) {
      users[element].tweets.forEach(function(element, index, array) {
        var fixed = military(element.date);
        var fav = (users[home].favorites.indexOf(element));
        if (fav !== -1) { fav = true }
        var retweet = 'None';
        if (element.retweet.id) { retweet = element.retweet }
        tweets.push({
          name: element.name,
          id: element.id,
          handle: element.handle,
          date: element.date,
          content: element.content,
          sort: fixed,
          fav: fav,
          retweet: retweet
        })
      })
    })
  }
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}
// split mentions into array
function mention(content) {
  var array = content.split(/(@[a-z\d-]+)/)
  var mentions = [];
  array.forEach(function(element, index, array) {
    if (element.search(/@([a-z\d-]+)/) === 0) {
      mentions.push(element.slice(1));
    }
  })
  return mentions;
}
// push mentions
function pushMentions(mentions, hoot) {
  mentions.forEach(function(element, index, array) {
    users[element].notifications.push(hoot);
  })
}

app.use(function(req, res, next) {
  console.log(req.url);
  next();
})

app.use(cookieParser());

app.get('/landing', function(req, res) {
  var payload = [];
  for (prop in users) {
    if (users[prop].tweets) {
      users[prop].tweets.forEach(function(element, index, array) {
        var fixed = military(element.date);
        payload.push({
          name: element.name,
          id: element.id,
          handle: element.handle,
          date: element.date,
          content: element.content,
          sort: fixed,
        })
      })
    }
  }
  payload = _.sortBy(payload, 'sort').reverse();
  payload = payload.slice(0, 30);
  res.send(payload);
})

app.get('/check', function(req, res) {
  if (req.cookies.user) {
    var user = req.cookies.user;
    var cookie = req.cookies.session;
    if (users[user].cookies.indexOf(cookie) !== -1) {
      res.sendStatus(240);
    } else {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(200);
  }
})

app.post('/login', jSonParser, function(req, res) {
  var user = req.body.user;
  var password = req.body.password;
  if (login(user, password) === 200) {
    var cookie = makeCookie();
    users[user].cookies.push(cookie),
    res.cookie('user', user);
    res.cookie('session', cookie);
    res.sendStatus(200);
  }
  if (login(user, password) === 403) {
    res.sendStatus(403);
  }
})

app.post('/logout', function(req, res) {
  res.clearCookie('session');
  res.clearCookie('user');
  res.send();
})

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

app.post('/followers', jSonParser, function(req, res) {
  var user = req.body.me;
  var type = req.body.type;
  var youFollow = false;
  var payload = [];
  users[user][type].forEach(function(element, index, array) {
    if (users[user].following.indexOf(element) !== -1) { youFollow = true }
    payload.push({
      name: users[element].name,
      handle: users[element].handle,
      tweets: users[element].tweets.length,
      followers: users[element].followers.length,
      following: users[element].following.length,
      follow: youFollow,
      me: user
    })
  })
  res.send(payload);
})

app.post('/hoot', jSonParser, function(req, res) {
  id++
  var handle = req.body.handle;
  var content = req.body.content;
  var hoot = {
    name: users[handle].name,
    handle: handle,
    id: id,
    date: format(),
    content: content,
    tags: [],
    mentions: mention(content),
    retweet: []
  }
  pushMentions(hoot.mentions, hoot);
  users[handle].tweets.push(hoot);
  res.send();
})

app.post('/rehoot', jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  var payload = {};
  users[handle].tweets.forEach(function(element, index, array) {
    if (element.id === id) { payload = element }
  })
  res.send(payload);
})

app.post('/addRehoot', jSonParser, function(req, res) {
  id++
  var rehoot = {};
  var rehootId = Number(req.body.rehootId);
  var rehootHandle = req.body.rehootHandle;
  users[rehootHandle].tweets.forEach(function(element, index, array) {
    if (element.id === rehootId) {
      rehoot = element;
      return;
    }
  })
  var handle = req.body.handle;
  var content = req.body.content;
  var hoot = {
    name: users[handle].name,
    handle: handle,
    id: id,
    date: format(),
    content: content,
    tags: [],
    mentions: mention(content),
    retweet: rehoot
  }
  pushMentions(hoot.mentions, hoot);
  users[handle].tweets.push(hoot);
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
      array.splice(index, 1);
      return;
    }
  })
  res.send();
})

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Connect to the server on http://localhost:8080');
})
