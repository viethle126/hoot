var express = require('express');
var jSonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
var _ = require('underscore');
var app = express();
// custom modules
var users = require('./users.js');
var convo = require('./convo.js');
var timestamp = require('./timestamp');
var random = require('./random.js');
// generate random hoots for all users, return id count
var id = random.begin();
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
// check favorite
function heart(home, hoot) {
  if (users[home].favorites.indexOf(hoot) !== -1) {
    return true;
  } else {
    return false;
  }
}
// prepare tweet
function prepare(home, hoot) {
  var retweet = 'None';
  if (hoot.retweet.id) {
    retweet = prepare(home, hoot.retweet)
  }

  return {
    name: hoot.name,
    id: hoot.id,
    handle: hoot.handle,
    date: hoot.date,
    content: hoot.content,
    sort: timestamp.military(hoot.date),
    fav: heart(home, hoot),
    retweet: retweet,
  }
}
// return an array of hoots
function timeline(user, me, type) {
  var tweets = [];
  switch(type) {
    case 'favorites':
    users[me].favorites.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    case 'notifications':
    users[me].notifications.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    case 'home': // push followers' hoots, continue to next case
    users[me].following.forEach(function(element, index, array) {
      users[element].tweets.forEach(function(element, index, array) {
        tweets.push(prepare(me, element));
      })
    })
    case 'tweets': // push user's hoots
    users[user].tweets.forEach(function(element, index, array) {
      tweets.push(prepare(me, element));
    })
    break;
    default:
    break;
  }
  tweets = _.sortBy(tweets, 'sort');
  return tweets;
}
// push mentions
function pushMentions(mentions, hoot) {
  mentions.forEach(function(element, index, array) {
    users[element].notifications.push(hoot);
  })
}
// split mentions into array
function parseUsers(input) {
  var array = input.split(/(@[a-z\d-]+)/)
  var mentions = [];
  array.forEach(function(element, index, array) {
    if (element.search(/@([a-z\d-]+)/) === 0) {
      mentions.push(element.slice(1));
    }
  })
  return mentions;
}
// split search string into components
function parseSearch(input) {
  var string = input.split(/(@[a-z\d-]+)/);
  var stripped = []
  string.forEach(function(element, index, array) {
    if (element[0] === ' ' && element.search(/@([a-z\d-]+)/) === -1) {
      stripped.push(element.slice(1))
      return;
    }
    if (element.search(/@([a-z\d-]+)/) === -1) {
      stripped.push(element);
      return;
    }
  })
  string = stripped.join('');
  return string;
}
// search for tweets by string, user or hashtag(implement later)
function search(input, home) {
  var byUser = [];
  var byString = [];
  var handles = parseUsers(input);
  var string = parseSearch(input);
  if (string === '') { string = 'foobar' }
  var reg = new RegExp('(' + string + ')');
  handles.forEach(function(element, index, array) {
    if (users[element]) {
      byUser = byUser.concat(timeline(element, home, 'tweets'));
      return byUser;
    }
  })
  for (prop in users) {
    users[prop].tweets.forEach(function(element, index, array) {
      if (element.content.search(reg) !== -1) {
        byString.push(element);
      }
    })
  }
  return { byUser: byUser, byString: byString }
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
        var fixed = timestamp.military(element.date);
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

app.post('/search', jSonParser, function(req, res) {
  res.send(search(req.body.search, req.body.home));
})

app.post('/timeline', jSonParser, function(req, res) {
  res.send(timeline(req.body.handle, req.body.home, req.body.type));
})

app.post('/card', jSonParser, function(req, res) {
  var user = req.body.handle;
  var me = req.body.home;
  var youFollow = false;
  if (users[user].followers.indexOf(me) !== -1) { youFollow = true }
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
    youFollow = false;
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

app.post('/addHoot', jSonParser, function(req, res) {
  id++
  var handle = req.body.handle;
  var content = req.body.content;
  var hoot = {
    name: users[handle].name,
    handle: handle,
    id: id,
    date: timestamp.civilian(),
    content: content,
    tags: [],
    mentions: parseUsers(content),
    retweet: 'None'
  }
  pushMentions(hoot.mentions, hoot);
  users[handle].tweets.push(hoot);
  res.send();
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
    date: timestamp.civilian(),
    content: content,
    tags: [],
    mentions: parseUsers(content),
    retweet: rehoot
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
