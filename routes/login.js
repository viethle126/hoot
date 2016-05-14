var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
// custom modules
var users = require('../lib/users');

// add string to cookie
function extendCookie(count, cookie) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz';
  var pick = Math.floor(Math.random() * 62);

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
  var pick = Math.floor(Math.random() * 61);
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

// sign up
function signup(data) {
  if (users.keys.indexOf(data.user) !== -1) {
    return 422;
  } else {
    users[data.user] = {
      password: data.password,
      name: data.full,
      handle: data.user,
      image: 'images/default.jpg',
      tweets: [],
      followers: [],
      following: [],
      notifications: [],
      favorites: [],
      cookies: [],
      alerts: 0
    }
    users.updateKeys();
    return;
  }
}

router.use(cookieParser());

router.post('/', jSonParser, function(req, res) {
  var user = req.body.user;
  var password = req.body.password;
  if (login(user, password) === 200) {
    var cookie = makeCookie();
    users[user].cookies.push(cookie),
    res.cookie('user', user);
    res.cookie('session', cookie);
    res.sendStatus(200);
  }
  if (login(user, password) === 401) {
    res.sendStatus(401);
  }
})

router.post('/logout', function(req, res) {
  res.clearCookie('session');
  res.clearCookie('user');
  res.send();
})

router.post('/signup', jSonParser, function(req, res) {
  signup(req.body);
  var cookie = makeCookie();
  users[req.body.user].cookies.push(cookie);
  res.cookie('user', req.body.user);
  res.cookie('session', cookie);
  res.sendStatus(200);
})

module.exports = router;
