var users = require('../users');
var convo = require('../convo');
var moment = require('moment');
moment().format();

function random() {
  var ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor.'.split(' ');
  var trending = [];

  function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  function cut(start, length) {
    var content = [];
    for (var i = start; i < start + length; i++) {
      if (i > 379) {
        content.push(ipsum[i - 380]);
      } else {
        content.push(ipsum[i]);
      }
    }
    content = content.join(' ');
    if (content[content.length - 1] === ',' || content[content.length - 1] === '.') {
      content = content.slice(0, -1);
    }
    return capitalize(content + '.');
  }

  function content(mention, trend) {
    var start = Math.floor(Math.random() * 380);
    var length = Math.floor(Math.random() * 15) + 6;
    var user = '';
    if (mention[0] !== undefined) { user = ' @' + mention[0] }
    return cut(start, length) + user + ' ' + trend;
  }

  function date() {
    var randomDate = Math.floor(Math.random() * (Number(Date.now()) - 1451606400000)) + 1451606400000;
    return randomDate;
  }

  function addFavorite(user, pick) {
    var fav = Math.floor(Math.random() * users[pick].tweets.length);
    while (users[pick].tweets[fav].retweet !== 'None') {
      fav = Math.floor(Math.random() * users[pick].tweets.length);
    }
    users[user].favorites.push(users[pick].tweets[fav]);
  }

  function favorites() {
    users.keys.forEach(function(element, index, array) {
      var count = Math.floor(Math.random() * 3) + 3;
      var pool = users.keys.slice();
      pool.splice(pool.indexOf(element), 1);
      while (count > 0) {
        var pick = pool[Math.floor(Math.random() * pool.length)];
        pool.splice(pool.indexOf(pick), 1);
        count--;
        addFavorite(element, pick);
      }
      return;
    })
  }

  function pushMention(user, data) {
    if (user !== undefined) {
      users[user].notifications.push(data);
      users[user].alerts++;
    } else {
      return;
    }
  }

  function pickMention(who) {
    var mention = [];
    var pick = users.keys[Math.floor(Math.random() * users.keys.length)];
    while (pick === who) {
      pick = users.keys[Math.floor(Math.random() * users.keys.length)];
    }
    if (Math.random() < 0.2) {
      mention.push(pick);
    }
    return mention;
  }

  function pushTrends(trend, count) {
    if (count > 0) {
      count--;
      trending.push(trend);
      pushTrends(trend, count);
    } else {
      return;
    }
  }

  function prepTrending(trends) {
    trends.forEach(function(element, index, array) {
      var trend = element.name;
      var count = element.percent;
      if (count === null || count === 0) { count = 1 }
      pushTrends(trend, count);
    })
  }

  function pickTrend() {
    var max = trending.length;
    var pick = Math.floor(Math.random() * max);
    return trending[pick];
  }

  function pickRetweet(who, date, picture) {
    var retweet = 'None';
    if (Math.random() < 0.2 && picture === 'None') {
      var id = Math.floor(Math.random() * users.id) + 1;
      users.keys.forEach(function(element, index, array) {
        if (element !== who) {
          users[element].tweets.forEach(function(element, index, array) {
            if (element.id === id) {
              if (element.date < date && element.retweet === 'None') {
                retweet = element;
                return retweet;
              }
            }
          })
        }
      })
    }
    return retweet;
  }

  function picture() {
    var picture = 'None';
    if (Math.random() < 0.25) {
      var pick = Math.floor(Math.random() * 76) + 1;
      picture = 'images/random/' + pick + '.jpg';
    }
    return picture;
  }

  function tweet(who, quantity) {
    quantity--;
    users.id++;
    var mention = pickMention(who);
    var trend = pickTrend();
    var data = {
      name: users[who].name,
      handle: who,
      id: users.id,
      date: date(),
      content: content(mention, trend),
      picture: picture(),
      mentions: mention,
      tags: [trend],
      retweet: 'None'
    }
    data.retweet = pickRetweet(who, data.date, data.picture);
    users[who].tweets.push(data);
    pushMention(mention[0], data);
    if (quantity > 0) {
      tweet(who, quantity);
    } else {
      return;
    }
  }

  function follow(who, array, count) {
    var picked = users[array[Math.floor(Math.random() * array.length)]];
    if (count > 0) {
      users[who].following.push(picked.handle);
      picked.followers.push(users[who].handle);
      array.splice(array.indexOf(picked.handle), 1);
      count--
      follow(who, array, count);
    } else {
      return;
    }
  }

  function prepMessage(who, id) {
    var data = {
      user: who,
      content: content([], ''),
      id: id
    }
    return data;
  }

  function messages() {
    users.keys.forEach(function(element, index, array) {
      var id = convo.id();
      var who = [users[element].following[0], users[element].following[1]];
      convo.new([element, who[0]]);
      convo.send(prepMessage(element, id));
      convo.send(prepMessage(who[0], id));
      convo.invite(who[1], id);
      convo.send(prepMessage(who[1], id));
    })
  }

  function begin(trends) {
    prepTrending(trends);
    users.keys.forEach(function(element, index, array) {
      var quantity = Math.floor(Math.random() * 30) + 20;
      var count = Math.floor(Math.random() * 10) + 6;
      var clone = users.keys.slice();
      clone.splice(clone.indexOf(element), 1);
      tweet(element, quantity);
      follow(element, clone, count);
    })
    favorites();
    messages();
  }

  return {
    begin: begin
  }
}

module.exports = random();
