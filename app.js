var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
// custom modules
var users = require('./lib/users');
// routes
var landing = require('./routes/landing');
var login = require('./routes/login');
var alerts = require('./routes/alerts');
var card = require('./routes/card');
var timeline = require('./routes/timeline');
var tweets = require('./routes/tweets');
var favorite = require('./routes/favorite');
var follow = require('./routes/follow');
var recommend = require('./routes/recommend');
var messages = require('./routes/messages');
var trends = require('./routes/trends');
// verify that user is logged in with a valid cookie
function verify(req, res, next) {
  if (req.cookies.user) {
    var user = req.cookies.user;
    var cookie = req.cookies.session;
    if (users[user].cookies.indexOf(cookie) !== -1) {
      next();
    } else {
      res.status(401);
    }
  } else {
    res.status(401);
  }
}

app.use(function(req, res, next) {
  console.log(req.url);
  next();
})
app.use(cookieParser());
app.use('/landing', landing);
app.use('/login', login);
app.use('/alerts', verify, alerts);
app.use('/card', verify, card);
app.use('/timeline', verify, timeline);
app.use('/tweets', verify, tweets);
app.use('/favorite', verify, favorite);
app.use('/follow', verify, follow);
app.use('/recommend', verify, recommend);
app.use('/messages', verify, messages);
app.use('/trends', verify, trends);
app.use(express.static('public'));

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('Listening on port: ' + port);
})
