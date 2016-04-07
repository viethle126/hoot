var express = require('express');
var jSonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
var _ = require('underscore');
var app = express();
// custom modules
var users = require('./data/users');

var trends = require('./data/trends');
var parse = require('./data/utility/parse');
var timestamp = require('./data/utility/timestamp');
// routes
var login = require('./routes/login');
var messages = require('./routes/messages');
// request trends, generate random hoots
trends.request();

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
// suggest users most commonly followed by your followers
function suggest(who) {
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
// push mentions
function pushMentions(mentions, hoot) {
  mentions.forEach(function(element, index, array) {
    users[element].notifications.push(hoot);
  })
}
// search for tweets by string, user or hashtag(implement later)
function search(input, home) {
  var byUser = [];
  var byString = [];
  var handles = parse.users(input);
  var string = parse.string(input);
  if (string === '') { string = 'foobar' }
  var reg = new RegExp('(' + string + ')');
  handles.forEach(function(element, index, array) {
    if (users[element]) {
      byUser = byUser.concat(timeline(element, home, 'tweets'));
      return byUser;
    }
  })
  users.keys.forEach(function(element, index, array) {
    users[element].tweets.forEach(function(element, index, array) {
      if (element.content.toLowerCase().search(reg) !== -1) {
        byString.push(prepare(home, element));
      }
    })
  })
  byUser = _.sortBy(byUser, 'sort').reverse();
  byString = _.sortBy(byString, 'sort').reverse();
  return { byUser: byUser, byString: byString }
}
// check if users exist, return error if any fail

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
app.use('/login', login);
app.use('/messages', messages);

app.get('/status', function(req, res) {
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
});

app.get('/landing', function(req, res) {
  var payload = [];
  users.keys.forEach(function(element, index, array) {
    if (users[element].tweets) {
      users[element].tweets.forEach(function(element, index, array) {
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
  })
  payload = _.sortBy(payload, 'sort').reverse();
  payload = payload.slice(0, 30);
  res.send(payload);
})

app.get('/trends', verify, function(req, res) {
  res.send(trends.stats);
})

app.post('/recommended', verify, jSonParser, function(req, res) {
  res.send(suggest(req.body.user));
})

app.post('/search', verify, jSonParser, function(req, res) {
  res.send(search(req.body.search, req.body.home));
})

app.post('/timeline', verify, jSonParser, function(req, res) {
  res.send(timeline(req.body.handle, req.body.home, req.body.type));
})

app.post('/card', verify, jSonParser, function(req, res) {
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

app.post('/follow', verify, jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.push(handle);
  users[handle].followers.push(me);
  res.send();
})

app.post('/unfollow', verify, jSonParser, function(req, res) {
  var handle = req.body.handle;
  var me = req.body.home;
  users[me].following.splice(users[me].following.indexOf(handle), 1);
  users[handle].followers.splice(users[handle].followers.indexOf(me), 1);
  res.send();
})

app.post('/followers', verify, jSonParser, function(req, res) {
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

app.post('/addHoot', verify, jSonParser, function(req, res) {
  users.id++
  var handle = req.body.handle;
  var content = req.body.content;
  var hoot = {
    name: users[handle].name,
    handle: handle,
    id: users.id,
    date: timestamp.civilian(),
    content: content,
    mentions: parse.users(content),
    retweet: 'None'
  }
  pushMentions(hoot.mentions, hoot);
  users[handle].tweets.push(hoot);
  res.send();
})

app.post('/addRehoot', verify, jSonParser, function(req, res) {
  users.id++
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
    id: users.id,
    date: timestamp.civilian(),
    content: content,
    mentions: parse.users(content),
    retweet: rehoot
  }
  pushMentions(hoot.mentions, hoot);
  users[handle].tweets.push(hoot);
  res.send();
})

app.post('/rehoot', verify, jSonParser, function(req, res) {
  var handle = req.body.handle;
  var id = Number(req.body.id);
  var payload = {};
  users[handle].tweets.forEach(function(element, index, array) {
    if (element.id === id) { payload = element }
  })
  res.send(payload);
})

app.post('/addFavorite', verify, jSonParser, function(req, res) {
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

app.post('/removeFavorite', verify, jSonParser, function(req, res) {
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

var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('Connect to the server on port ' + port);
})
