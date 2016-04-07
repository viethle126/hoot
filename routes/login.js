var express = require('express');
var router = express.Router();
var jSonParser = require('body-parser').json();
var users = require('../data/users');

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

module.exports = router;
