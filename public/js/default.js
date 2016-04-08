// make element with attribute
function elemAttribute(elem, name, value) {
  var element = document.createElement(elem);
  element.setAttribute(name, value);
  return element;
}
// make element with classes
function elemClass(elem, classes) {
  var element = document.createElement(elem);
  element.className = classes;
  return element;
}
// parse handles into array
function parseUsers(input) {
  var array = input.split(/(@[a-z\d-]+)/i)
  var users = [];
  array.forEach(function(element, index, array) {
    if (element.search(/@([a-z\d-]+)/i) === 0) {
      users.push(element.slice(1));
    }
  })
  return users;
}
// remove trends (to replace with links)
function parseTrends(input) {
  var array = input.split(/(#[a-z\d-]+)/i);
  var string = [];
  array.forEach(function(element, index, array) {
    if (element.search(/#([a-z\d-]+)/i) === -1) {
      string.push(element);
      return;
    }
  })
  string = string.join('');
  return string;
}
// remove child nodes
function clear(id, count) {
  var element = document.getElementById(id);
  var count = count || element.childNodes.length;
  if (count > 0) {
    count--;
    element.childNodes[0].remove();
    clear(id, count);
  } else {
    return;
  }
}
// XHR: login
function login() {
  var data = {
    user: document.getElementById('username').value,
    password: document.getElementById('password').value
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
      document.location.reload(true)
    } else {
      document.getElementById('fail').classList.remove('hidden');
      setTimeout(function() {
        document.getElementById('fail').classList.add('hidden');
      }, 4000)
    }
  })
}
// XHR: logout
function logout() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login/logout', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    document.location.reload(true);
  })
}
// XHR: sign up
function signup() {
  var data = {
    full: document.getElementById('regfull').value,
    user: document.getElementById('regname').value,
    password: document.getElementById('regpass').value
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login/signup', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
      document.location.reload(true)
    } else {
      document.getElementById('taken').classList.remove('hidden');
      setTimeout(function() {
        document.getElementById('taken').classList.add('hidden');
      }, 4000)
    }
  })
}
// XHR: request alerts
function wantAlerts() {
  var data = { user: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/alerts', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var count = JSON.parse(xhr.response).alerts;
    alert(count);
  })
}
// XHR: clear alerts
function clearAlerts() {
  var data = { user: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/alerts/clear', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var count = JSON.parse(xhr.response).alerts;
    alert(count);
  })
}
// XHR: request trends
function wantTrends() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/trends', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    data = JSON.parse(xhr.response).reverse();
    for (var i = 0; i < 20; i++) {
      var size = trendSize(data[i]);
      addTrend(data[i], size);
    }
  })
}
// append trend to trending list
function addTrend(data, size) {
  var trending = document.getElementById('trending');
  var link = elemClass('a', 'item');
  var header = elemClass(size, 'ui header');
  var headerText = document.createTextNode(data.name);
  header.appendChild(headerText);
  link.appendChild(header);
  link.setAttribute('data-trend', data.name);
  trending.appendChild(link);
}
// set trend text size based on percentage
function trendSize(data) {
  if (data.percent > 15) {
    return 'h2';
  } else if (data.percent > 10) {
    return 'h3';
  } else if (data.percent > 5) {
    return 'h4';
  } else {
    return 'h5';
  }
}
// XHR: request recommended
function wantRecommended() {
  var data = { user: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/recommend', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var users = JSON.parse(xhr.response).reverse();
    var count = 5;
    if (users.length < 5) { count = users.length }
    for (var i = 0; i < count; i++) {
      addRecommended(users[i].handle);
    }
  })
}
// append recommended to recommended list
function addRecommended(user) {
  var list = document.getElementById('recommended');
  var item = elemClass('div', 'item');
  var image = elemClass('img', 'ui avatar image');
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode('@' + user);

  header.setAttribute('data-visit', 1);
  header.appendChild(headerText);
  content.appendChild(header);
  image.setAttribute('src', '/images/' + user + '.jpg');
  item.setAttribute('data-visit', 1);
  item.setAttribute('data-handle', user);
  item.appendChild(image);
  item.appendChild(content);
  list.appendChild(item);
}
// append header
function addHeader(what, where) {
  var location = document.getElementById(where);
  var message = elemClass('h3', 'ui header');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(what);
  header.appendChild(headerText);
  message.appendChild(header);
  location.appendChild(message);
}
// XHR: submit search
function search(input) {
  var data = { search: input, home: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline/search', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    document.getElementById('search-input').value = '';
    resetMenu();
    clear('search-results');
    show('search-results');
    showCard('card');
    addHeader('Showing search results for: ' + input, 'search-results');

    var payload = JSON.parse(xhr.responseText);
    payload.byUser.forEach(function(element, index, array) {
      addTweet(element, 'search-results');
    })
    payload.byString.forEach(function(element, index, array) {
      addTweet(element, 'search-results');
    })
  })
}
// XHR: submit tweet
function tweet() {
  var data = {
    content: document.getElementById('hoot-content').value,
    handle: me
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tweets/addTweet', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    wantLine(me, 'your-timeline', me, 'home');
    toggle('success');
  })
}
// XHR: submit retweet
function retweet() {
  var item = document.getElementById('rehoot-here').childNodes[0];
  var data = {
    content: document.getElementById('hoot-content').value,
    handle: me,
    retweetId: item.getAttribute('data-hoot-id'),
    retweetHandle: item.getAttribute('data-handle')
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'tweets/addRetweet', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    wantLine(me, 'your-timeline', me, 'home');
    toggle('success');
  })
}
// XHR: request retweet data
function wantRetweet(target) {
  toggle('rehoot');
  var item = target.parentNode;
  while (!item.dataset.handle) {
    item = item.parentNode;
  }
  var data = {
    handle: item.getAttribute('data-handle'),
    id: item.getAttribute('data-hoot-id')
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'tweets/getRetweet', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var payload = JSON.parse(xhr.responseText);
    var stacked = document.getElementById('rehoot-here');
    while (stacked.hasChildNodes()) {
      stacked.removeChild(stacked.firstChild);
    }
    addTweet(payload, 'rehoot-here');
  })
}
// append tweet to timeline
function addTweet(data, where) {
  var timeline = document.getElementById(where);
  var item = elemClass('div', 'item');
  var imageDiv = elemClass('div', 'ui tiny image');
  var image = elemAttribute('img', 'src', data.image);
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(data.name);
  var meta = elemClass('div', 'meta');
  var span = document.createElement('span');
  var spanText = document.createTextNode('@' + data.handle + ' - ' + data.date);
  var desc = elemClass('div', 'description');
  var para = document.createElement('p');
  var paraText = document.createTextNode(parseTrends(data.content));
  var extra = elemClass('div', 'extra');
  var retweetLink = elemAttribute('a', 'data-retweet', 'false');
  var retweet = elemClass('i', 'retweet icon');
  var favLink = elemAttribute('a', 'data-fav', 'false');
  var fav = elemClass('i', 'empty heart icon');

  if (data.fav === true) {
    fav.setAttribute('class', 'heart icon');
    favLink.setAttribute('data-fav', 'true');
  }
  retweetLink.appendChild(retweet);
  favLink.appendChild(fav);
  extra.appendChild(retweetLink);
  extra.appendChild(favLink);
  para.appendChild(paraText);
  desc.appendChild(para);
  span.appendChild(spanText);
  meta.appendChild(span);
  header.setAttribute('data-visit', 1);
  header.appendChild(headerText);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  content.appendChild(extra);
  image.setAttribute('data-visit', 1);
  imageDiv.appendChild(image);
  item.appendChild(imageDiv);
  item.appendChild(content);
  item.setAttribute('data-hoot-id', data.id);
  item.setAttribute('data-handle', data.handle);
  timeline.appendChild(item);

  data.tags.forEach(function(element, index, array) {
    if (element[0] === '#') {
      var tag = document.createElement('a');
      var tagText = document.createTextNode(element);
      tag.setAttribute('data-trend', element);
      tag.appendChild(tagText);
      para.appendChild(tag);
    }
  })
  if (data.retweet !== 'None') {
    var retweeted = document.createTextNode(data.name + ' rehoots:')
    var stacked = elemClass('div', 'ui raised stacked segment items');
    header.appendChild(retweeted);
    header.removeChild(headerText);
    content.removeChild(extra);
    timeline.appendChild(stacked);
    stacked.setAttribute('id', 'temporary');
    addTweet(data.retweet, 'temporary');
    stacked.removeAttribute('id');
    return;
  }
  if (where === 'rehoot-here') {
    content.removeChild(extra);
  }
}
// append compact tweets (landing)
function addSmall(data) {
  var landing = document.getElementById('landing');
  var card = elemClass('div', 'card');
  var content = elemClass('div', 'content');
  var image = elemClass('img', 'ui left floated mini image');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(data.name);
  var meta = elemClass('div', 'meta');
  var metaText = document.createTextNode('@' + data.handle + ' - ' + data.date);
  var desc = elemClass('div', 'description');
  var descText = document.createTextNode(data.content);

  desc.appendChild(descText);
  meta.appendChild(metaText);
  header.appendChild(headerText);
  image.setAttribute('src', data.image);
  content.appendChild(image);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  card.appendChild(content);
  landing.appendChild(card);
}
// append notifications to timeline
function addNote(data) {
  var timeline = document.getElementById('note-timeline');
  var container = elemClass('div', 'ui raised segment items');
  var message = elemClass('div', 'ui compact floating violet message');
  var icon = elemClass('i', 'twitch icon');
  var content = elemClass('div', 'content');
  var span = document.createElement('span');
  var spanText = document.createTextNode(data.name + ' (@' + data.handle + ') mentioned you in a hoot:')
  span.appendChild(spanText);
  content.appendChild(icon);
  content.appendChild(span);
  message.appendChild(content);
  container.appendChild(message);
  timeline.appendChild(container);
  container.setAttribute('id', 'note');
  addTweet(data, 'note');
  container.removeAttribute('id');
}
// XHR: request landing page
function wantLanding() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/landing', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText)
    tweets.forEach(function(element, index, array) {
      addSmall(element);
    })
  })
}
// XHR: request timeline
function wantLine(user, where, homeuser, type) {
  clear(where);
  var data = { handle: user, home: homeuser, type: type }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText).reverse();
    if (tweets.length === 0) {
      if (where === 'note-timeline') {
        addHeader('You have no notifications', 'note-timeline');
      } else if (where === 'fav-timeline') {
        addHeader('You have no favorites', 'fav-timeline');
      } else {
        addHeader('You have no hoots', where);
      }
    }
    remainingLine = tweets.slice(20);
    var displayed = tweets.length;
    if (displayed > 20) { displayed = 20 } // show up to 20
    for (var i = 0; i < displayed; i++) {
      if (type !== 'notifications') {
        addTweet(tweets[i], where)
      } else {
        addNote(tweets[i]);
      }
    }
    wantAlerts();
  })
}
// append card
function card(data, where) {
  var card = document.getElementById(where);
  var imageDiv = elemClass('div', 'image');
  var image = elemAttribute('img', 'src', data.image);
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(data.name);
  var meta = elemClass('div', 'meta');
  var handleSpan = elemClass('span', 'date');
  var handleText = document.createTextNode('@' + data.handle);
  var breakOne = document.createElement('br');
  var countSpan = elemClass('a', 'date');
  var write = elemClass('i', 'edit icon icon');
  var writeText = document.createTextNode(data.tweets + ' Hoots');
  var breakTwo = document.createElement('br');
  var msgLink = elemClass('a', 'date');
  var msg = elemClass('i', 'mail icon');
  var msgText = document.createTextNode('Send message');
  var desc = elemClass('div', 'description');
  var segment = elemClass('div', 'ui basic center aligned segment');
  var follow = elemClass('button', 'ui basic violet button');
  var add = elemClass('i', 'add user icon');
  var unfollow = elemClass('button', 'ui basic violet button');
  var remove = elemClass('i', 'remove user icon');
  var extra = elemClass('div', 'extra content');
  var followingLink = document.createElement('a');
  var following = elemClass('i', 'user icon');
  var followingText = document.createTextNode(data.following);
  var floated = elemClass('span', 'right floated');
  var followerLink = document.createElement('a');
  var follower = elemClass('i', 'users icon');
  var followerText = document.createTextNode(data.followers);

  followingLink.setAttribute('data-go', 'following');
  followingLink.appendChild(following);
  followingLink.appendChild(followingText)
  followerLink.setAttribute('data-go', 'followers');
  followerLink.appendChild(follower);
  followerLink.appendChild(followerText);
  floated.appendChild(followerLink);
  extra.appendChild(followingLink);
  extra.appendChild(floated);
  follow.appendChild(add);
  follow.setAttribute('data-follow-text', 'Follow'); // use later
  unfollow.appendChild(remove);
  unfollow.setAttribute('data-follow-text', 'Unfollow'); // use later
  segment.appendChild(follow);
  segment.appendChild(unfollow);
  if (data.handle !== me) { desc.appendChild(segment) }
  handleSpan.appendChild(handleText);
  countSpan.setAttribute('data-hoots', true);
  countSpan.appendChild(write);
  countSpan.appendChild(writeText);
  meta.appendChild(handleSpan);
  meta.appendChild(breakOne);
  meta.appendChild(countSpan);
  if (data.handle !== me) {
    msgLink.setAttribute('data-send-msg', true);
    msgLink.appendChild(msg);
    msgLink.appendChild(msgText);
    meta.appendChild(breakTwo);
    meta.appendChild(msgLink);
  }
  header.appendChild(headerText);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);

  imageDiv.appendChild(image);
  card.appendChild(imageDiv);
  card.appendChild(content);
  card.appendChild(extra);
  card.setAttribute('data-handle', data.handle);

  if (data.handle !== me) {
    image.setAttribute('data-visit', 1);
    header.setAttribute('data-visit', 1);
    handleSpan.setAttribute('data-visit', 1);
  }

  if (data.follow === true) {
    follow.classList.add('hidden');
  } else {
    unfollow.classList.add('hidden');
  }
}
// XHR: request card
function wantCard(user, where, me) {
  clear(where);
  var data = { handle: user, home: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/card', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var content = JSON.parse(xhr.responseText);
    card(content, where);
  })
}
// XHR: request list of followers or following
function wantFollowers(me, where, type) {
  clear(where);
  var data = { me: me, type: type }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/follow/list', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var payload = JSON.parse(xhr.responseText);
    payload.forEach(function(element, index, array) {
      var container = elemClass('div', 'ui card');
      document.getElementById('following').appendChild(container);
      container.setAttribute('id', 'foobar');
      card(element, 'foobar');
      container.removeAttribute('id');
    })
  })
}
// XHR: submit follow/unfollow
function follow(target) {
  var target = target;
  if (!target.dataset.followText) {
    target = target.parentNode;
  }
  var who = toData(target, 'handle');
  var action = target.dataset.followText.toLowerCase();
  var follow = target.parentNode.childNodes[0];
  var unfollow = target.parentNode.childNodes[1];
  var data = { handle: who, home: me }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/follow/' + action, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (action === 'follow') {
      follow.classList.add('hidden');
      unfollow.classList.remove('hidden');
    } else {
      unfollow.classList.add('hidden');
      follow.classList.remove('hidden');
    }
    wantCard(me, 'card', me)
  })
}
// XHR: add/remove favorites
function favorite(target, remove) {
  var target = target;
  var heart = target;
  if (target.dataset.fav) { heart = target.childNodes[0] }
  if (!target.dataset.fav) { target = target.parentNode }
  var item = target.parentNode;
  while (!item.dataset.handle) {
    item = item.parentNode;
  }

  var type = '';
  var handle = '';
  if (target.getAttribute('data-fav') === 'false') {
    type = "add";
    handle = item.getAttribute('data-handle');
  } else {
    type = "remove";
    handle = me;
  }

  var data = {
    handle: handle,
    id: item.getAttribute('data-hoot-id'),
    home: me
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/favorite/' + type, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (viewing === 'fav-timeline') {
      document.getElementById('fav-timeline').removeChild(item);
      if (document.getElementById('fav-timeline').childNodes.length === 0) {
        addHeader('You have no favorites', 'fav-timeline');
      }
    }
    if (type === 'add') {
      heart.setAttribute('class', 'heart icon');
      target.setAttribute('data-fav', 'true');
    } else {
      heart.setAttribute('class', 'empty heart icon');
      target.setAttribute('data-fav', 'false');
    }
  })
}
// remove me from list of users
function prepConvo(convos) {
  convos.forEach(function(element, index, array) {
    element.users.splice(element.users.indexOf(me), 1);
  })
  return convos;
}
// match convo user filter
function checkFilter(convos, filter) {
  filter.forEach(function(element, index, array) {
    var checking = element;
    convos.forEach(function(element, index, array) {
      if (element.users.indexOf(checking) === -1) {
        convos.splice(convos.indexOf(element), 1);
        checkFilter(convos, filter);
      }
    })
  })
  return convos;
}
// XHR: request list of conversations
function wantConvos(filter) {
  var data = { user: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'messages/list', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    clearConvos();
    var convos = JSON.parse(xhr.responseText);
    prepConvo(convos);
    if (filter) { checkFilter(convos, filter) }
    convos = convos.reverse();
    convos.forEach(function(element, index, array) {
      if (element.users[0] !== undefined) {
        addConvo(element);
      }
    })
  })
}
// XHR: request messages from a conversation
function wantMessages(which) {
  var data = { id: which }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'messages/get', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    clearMessages();
    var messages = JSON.parse(xhr.responseText).reverse();
    messages.forEach(function(element, index, array) {
      addMessage(element);
    })
    activeConvo(which);
    inConvo(which);
  })
}
// append error message
function errorMessage() {
  document.getElementById('msg-search').parentNode.parentNode.classList.add('hidden');
  document.getElementById('msg-filter').classList.add('hidden');
  document.getElementById('msg-error').classList.remove('hidden');
  setTimeout(function() {
    document.getElementById('msg-search').parentNode.parentNode.classList.remove('hidden');
    document.getElementById('msg-filter').classList.add('hidden');
    document.getElementById('msg-error').classList.add('hidden');
  }, 4000);
}
// XHR: submit new conversation
function createConvo(users) {
  var data = { users: users }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'messages/new', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (xhr.status === 208) {
      errorMessage();
    } else {
      var id = JSON.parse(xhr.responseText).id
      wantConvos()
    }
  })
}
// XHR: submit conversation modifications
function modifyConvo(who, which, type) {
  var data = { users: who, id: which }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/messages/' + type, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (type === 'invite' && xhr.status === 208) {
      errorMessage();
    }
    if (type === 'invite'){
      wantConvos();
      wantMessages(which);
    }
    if (type === 'leave') {
      wantConvos();
      clearMessages();
    }
  })
}
// XHR: submit reply
function reply() {
  var data = {
    user: me,
    content: document.getElementById('msg-send-input').value,
    id: document.getElementById('msg-here').getAttribute('data-convo-id')
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'messages/send', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    document.getElementById('msg-send-input').value = '';
    wantMessages(data.id);
  })
}
// append convo to list
function addConvo(data) {
  var list = document.getElementById('msg-list');
  var divider = elemClass('div', 'ui divider');
  var item = elemClass('a', 'item');
  var itemText = document.createTextNode('@' + data.users.join(', @'));

  divider.setAttribute('data-divider', 1);
  item.setAttribute('data-convo-list', 1);
  item.setAttribute('data-convo-id', data.id);
  item.appendChild(itemText);
  list.appendChild(divider);
  list.appendChild(item);
}
// clear convo list
function clearConvos() {
  var conversations = document.getElementById('msg-list');
  var nodes = conversations.childNodes;
  while (nodes.length > 0) {
    conversations.removeChild(conversations.firstChild);
  }
}
// reset convo active states
function convoReset() {
  var conversations = document.getElementById('msg-list');
  var nodes = conversations.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].dataset.convoId) {
      nodes[i].classList.remove('active');
    }
  }
}
// set convo active state
function activeConvo(id) {
  var conversations = document.getElementById('msg-list');
  var nodes = conversations.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].getAttribute('data-convo-id') === id) {
      nodes[i].classList.add('active');
    }
  }
}
// append message
function addMessage(data) {
  var messages = document.getElementById('msg-here');
  var item = elemClass('div', 'item');
  var content = elemClass('div', 'content');
  var image = elemClass('img', 'ui left floated mini image');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode('@' + data.user);
  var meta = elemClass('span', 'meta');
  var metaText = document.createTextNode(' - ' + data.date);
  var desc = elemClass('div', 'description');
  var descText = document.createTextNode(data.content)

  header.setAttribute('data-visit', 1);
  image.setAttribute('src', '/images/' + data.user + '.jpg');
  image.setAttribute('data-visit', 1);
  item.setAttribute('data-msg', 1);
  desc.appendChild(descText);
  meta.appendChild(metaText);
  header.appendChild(headerText);
  content.appendChild(image);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  item.appendChild(content);
  messages.appendChild(item);
}
// clear messages
function clearMessages() {
  var messages = document.getElementById('msg-here');
  var nodes = messages.childNodes;
  while (nodes.length > 3) {
    messages.removeChild(messages.lastChild);
  }
}
// append filter to conversation list
function addFilter(users) {
  var search = document.getElementById('msg-search').parentNode.parentNode;
  var filter = document.getElementById('msg-filter');
  var query = elemAttribute('span', 'id', 'filtered');
  var queryText = document.createTextNode(' ' + users);
  query.appendChild(queryText);
  filter.appendChild(query);
  filter.classList.remove('hidden');
  search.classList.add('hidden');
}
// clear filter
function clearFilter() {
  var search = document.getElementById('msg-search').parentNode.parentNode;
  var filter = document.getElementById('msg-filter');
  var query = document.getElementById('filtered');
  filter.removeChild(query);
  filter.classList.add('hidden');
  search.classList.remove('hidden');
}
// append list of users in conversation
function inConvo(id) {
  var target = document.getElementById('msg-list').childNodes[1];
  while (target.getAttribute('data-convo-id') !== id) {
    target = target.nextSibling.nextSibling
  }
  var users = target.textContent;
  var header = document.getElementById('msg-header');
  var span = document.createElement('span');
  var user = document.createTextNode('In this thread: ' + users);
  while (header.firstChild) {
    header.removeChild(header.firstChild);
  }

  span.appendChild(user);
  header.appendChild(span);
}
// reset menu active states
function resetMenu() {
  var menu = document.getElementById('menu').childNodes[1].childNodes;
  var items = [menu[1], menu[3], menu[5], menu[7], menu[9]];
  items.forEach(function(element, index, array) {
    element.setAttribute('data-active', 'false');
    element.classList.remove('active');
  })
}
// set menu active state
function activeMenu(item) {
  document.getElementById(item).setAttribute('data-active', 'true');
  document.getElementById(item).classList.add('active');
}
// set alert
function alert(count) {
  document.getElementById('alerts').textContent = count;
  if (count > 0) {
    document.getElementById('alerts').classList.add('violet');
  } else {
    document.getElementById('alerts').classList.remove('violet');
  }
}
// set hoot form state
function toggle(state) {
  var hoot = document.getElementById('menu').childNodes[1].childNodes[1];
  var container = document.getElementById('new-hoot');
  var form = document.getElementById('hoot-form');
  var header = document.getElementById('new');
  var rehootHeader = document.getElementById('rehoot');
  var content = document.getElementById('hoot-content');
  var stacked = document.getElementById('rehoot-here');
  var submit = document.getElementById('submit-hoot');
  var rehoot = document.getElementById('submit-rehoot');
  var success = document.getElementById('after-hoot')

  switch(state) {
    case 'hoot':
    hoot.setAttribute('data-active', 'true');
    hoot.classList.add('active');
    container.classList.remove('hidden');
    form.classList.remove('hidden');
    header.classList.remove('hidden');
    rehootHeader.classList.add('hidden');
    stacked.classList.add('hidden');
    submit.classList.remove('hidden');
    rehoot.classList.add('hidden');
    success.classList.add('hidden');
    break;

    case 'rehoot':
    hoot.setAttribute('data-active', 'true');
    hoot.classList.add('active');
    container.classList.remove('hidden');
    form.classList.remove('hidden');
    header.classList.add('hidden');
    rehootHeader.classList.remove('hidden');
    stacked.classList.remove('hidden');
    submit.classList.add('hidden');
    rehoot.classList.remove('hidden');
    success.classList.add('hidden');
    break;

    case 'success':
    content.value = '';
    hoot.setAttribute('data-active', 'false');
    hoot.classList.remove('active');
    form.classList.add('hidden');
    success.classList.remove('hidden');
    setTimeout(function() { container.classList.add('hidden') }, 4000);
    break;

    case 'close':
    content.value = '';
    hoot.setAttribute('data-active', 'false');
    hoot.classList.remove('active');
    container.classList.add('hidden');
    break;

    default:
    break;
  }
}
// show content
function show(element) {
  document.getElementById('landing').parentNode.classList.add('hidden');
  document.getElementById('new-hoot').classList.add('hidden');
  document.getElementById('following').classList.add('hidden');
  document.getElementById('search-results').classList.add('hidden');
  document.getElementById('your-timeline').classList.add('hidden');
  document.getElementById('your-hoots').classList.add('hidden');
  document.getElementById('visit-timeline').classList.add('hidden');
  document.getElementById('note-timeline').classList.add('hidden');
  document.getElementById('fav-timeline').classList.add('hidden');
  document.getElementById('msg-timeline').classList.add('hidden');
  document.getElementById('msg-here').classList.add('hidden');
  document.getElementById(element).classList.remove('hidden');
}
// show card
function showCard(element) {
  document.getElementById('card').classList.add('hidden');
  document.getElementById('visit-card').classList.add('hidden');
  document.getElementById(element).classList.remove('hidden');
}
// navigate to following/followers
function goFollowers(target, card) {
  var type = toData(target, 'go');
  var who = toData(target, 'handle');
  resetMenu();
  show('following');
  if (card === 'visit-card') {
    if (document.getElementById('visit-card').getAttribute('data-handle') !== who) {
      wantCard(who, 'visit-card', me);
    }
  }
  showCard(card);
  wantFollowers(who, 'following', type)
}
// navigate to your hoots
function goHoots(who) {
  var where = 'your-hoots';
  var card = 'card';
  if (who !== me) {
    where = 'visit-timeline';
    card = 'visit-card'
  }
  resetMenu();
  show(where);
  showCard(card);
  wantLine(who, 'your-hoots', who, 'tweets');
  viewing = 'your-hoots'
}
// navigate home
function goHome() {
  resetMenu();
  activeMenu('home');
  show('your-timeline');
  showCard('card');
  wantLine(me, 'your-timeline', me, 'home');
  viewing = 'your-timeline';
}
// navigate to other timeline
function goVisit(who) {
  resetMenu();
  show('visit-timeline');
  showCard('visit-card');
  if (document.getElementById('visit-card').getAttribute('data-handle') !== who) {
    wantCard(who, 'visit-card', me);
  }
  wantLine(who, 'visit-timeline', me, 'tweets');
  viewing = 'visit-timeline';
}
// navigate to notifications
function goNotifications() {
  resetMenu();
  activeMenu('notifications');
  show('note-timeline');
  showCard('card');
  wantLine(me, 'note-timeline', me, 'notifications');
  viewing = 'note-timeline';
}
// navigate to favorites
function goFavorites() {
  resetMenu();
  activeMenu('favorites');
  show('fav-timeline');
  showCard('card');
  wantLine('favorites', 'fav-timeline', me, 'favorites');
  viewing = 'fav-timeline';
}
// navigate to favorites
function goMessages() {
  resetMenu();
  activeMenu('messages');
  show('msg-timeline');
  showCard('card');
  wantConvos();
  viewing = 'msg-timeline';
}
// bubble up to find 'data-handle'
function toData(target, attribute) {
  var data = attribute;
  while (!target.dataset[data]) {
    target = target.parentNode;
  }
  return target.getAttribute('data-' + attribute);
}
// toggle Back to Top button or reveal more tweets
function onScroll() {
  var bottom = document.getElementById('recommended').parentNode;
  var bottomY = bottom.getBoundingClientRect().bottom;
  var max = $(document).height() - $(window).height();
  var current = window.scrollY;

  if (me !== false) {
    if (bottomY < 200 && showScroll === false) {
      showScroll = true;
      document.getElementById('top').classList.remove('hidden');
    }
    if (bottomY > 200 && showScroll === true) {
      showScroll = false;
      document.getElementById('top').classList.add('hidden');
    }
    if (current > max * .9 && viewing !== 'msg-timeline') {
      var displayed = remainingLine.length;
      if (displayed > 20) { displayed = 20 } // show up to 20 more
      for (var i = 0; i < displayed; i++) {
        if (viewing !== 'note-timeline') {
          addTweet(remainingLine[i], viewing)
        } else {
          addNote(remainingLine[i])
        }
      }
      remainingLine = remainingLine.slice(20);
      return
    }
  }
}
// event listener: menu
document.getElementById('menu').addEventListener('click', function(e) {
  if (me === false && e.target.id !== 'login') {
    $('.modal').modal('show');
    return;
  }
  var what = e.target;
  while (!what.id) {
    what = what.parentNode;
  }
  if (what.id === 'home' && what.getAttribute('data-active') === 'false') {
    goHome();
    return;
  }
  if (what.id === 'notifications') {
    goNotifications();
    clearAlerts();
    return;
  }
  if (what.id === 'favorites' && what.getAttribute('data-active') === 'false') {
    goFavorites();
    return;
  }
  if (what.id === 'messages' && what.getAttribute('data-active') === 'false') {
    goMessages();
    return;
  }
  if (what.id === 'hoot' && what.getAttribute('data-active') === 'false') {
    resetMenu();
    toggle('hoot');
    return;
  }
  if (what.id === 'hoot' && what.getAttribute('data-active') === 'true') {
    resetMenu();
    toggle('close');
    return;
  }
  if (what.id === 'search') {
    search(document.getElementById('search-input').value);
    return;
  }
});
// event listener: click
document.addEventListener('click', function(e) {
  // logging in or out
  if (e.target.id === 'login') {
    login();
    return;
  }
  if (e.target.id === 'logout') {
    logout();
    return;
  }
  if (e.target.id === 'regbutton') {
    signup();
    return;
  }
  // submitting hoots
  if (e.target.id === 'cancel-hoot') {
    toggle('close');
    return;
  }
  if (e.target.id === 'submit-hoot') {
    tweet();
    return;
  }
  if (e.target.id === 'submit-rehoot') {
    retweet();
    return;
  }
  // timeline related
  if (e.target.dataset.retweet || e.target.parentNode.dataset.retweet) {
    wantRetweet(e.target);
    window.scrollTo(0, 0);
    return;
  }
  if (e.target.dataset.fav || e.target.parentNode.dataset.fav) {
    favorite(e.target);
    return;
  }
  if (e.target.dataset.visit || e.target.parentNode.dataset.visit) {
    var who = toData(e.target, 'handle');
    goVisit(who);
    return;
  }
  if (e.target.dataset.trend || e.target.parentNode.dataset.trend) {
    var input = toData(e.target, 'trend')
    search(input);
    return;
  }
  if (e.target.id === 'top' || e.target.parentNode === 'top') {
    window.scrollTo(0, 0);
    return;
  }
  // card related
  if (e.target.dataset.go || e.target.parentNode.dataset.go) {
    var where = 'card';
    if (toData(e.target, 'handle') !== me) { where = 'visit-card' }
    goFollowers(e.target, where);
    return;
  }
  if (e.target.dataset.hoots || e.target.parentNode.dataset.hoots) {
    var who = toData(e.target, 'handle');
    goHoots(who);
    return;
  }
  if (e.target.dataset.sendMsg || e.target.parentNode.dataset.sendMsg) {
    who = toData(e.target, 'handle');
    goMessages();
    $('#new-dropdown').trigger('click');
    document.getElementById('msg-new').value = '@' + who;
    return;
  }
  if (e.target.dataset.followText || e.target.parentNode.dataset.followText) {
    follow(e.target);
    return;
  }
  // message related
  if (e.target.dataset.convoList) {
    var id = e.target.getAttribute('data-convo-id');
    document.getElementById('msg-here').setAttribute('data-convo-id', id);
    document.getElementById('msg-here').classList.remove('hidden');
    convoReset();
    inConvo(id);
    wantMessages(id);
    e.target.classList.add('active');
    return;
  }
  if (e.target.id === 'msg-filter' || e.target.parentNode.id === 'msg-filter') {
    document.getElementById('msg-search').value = '';
    clearFilter();
    wantConvos();
    return;
  }
  if (e.target.id === 'msg-leave' || e.target.parentNode.id === 'msg-leave') {
    var id = document.getElementById('msg-here').getAttribute('data-convo-id');
    modifyConvo(me, id, 'leave');
    show('msg-timeline');
    return;
  }
  if (e.target.id === 'msg-send' || e.target.parentNode.id === 'msg-send') {
    reply();
    return;
  }
})
// event listener: enter key
document.addEventListener('keydown', function(e) {
  if (e.keyCode == 13) {
    if (e.target.id === 'password') {
      login();
      return;
    }
    if (e.target.id === 'regpass') {
      signup();
      return;
    }
    if (e.target.id === 'search-input' && e.target.value !== '') {
      search(document.getElementById('search-input').value);
      return;
    }
    if (e.target.id === 'hoot-content' && e.target.value.replace(/[\n\s]/g, '') !== '') {
      if ($('#submit-rehoot').hasClass('hidden')) {
        tweet();
        return;
      }
      if ($('#submit-hoot').hasClass('hidden')) {
        retweet();
        return;
      }
    }
    if (e.target.id === 'msg-search' && e.target.value !== '') {
      var input = document.getElementById('msg-search').value;
      var parsed = parseUsers(input);
      addFilter(input);
      wantConvos(parsed);
      return;
    }
    if (e.target.id === 'msg-new' && e.target.value !== '') {
      var input = document.getElementById('msg-new').value;
      var parsed = parseUsers(input);
      parsed.push(me);
      createConvo(parsed);
      document.getElementById('msg-new').value = '';
      $('body').trigger('click');
      return;
    }
    if (e.target.id === 'msg-include' && e.target.value !== '') {
      var id = document.getElementById('msg-here').getAttribute('data-convo-id');
      var input = document.getElementById('msg-include').value;
      var parsed = parseUsers(input);
      modifyConvo(parsed, id, 'invite');
      wantConvos();
      wantMessages(id);
      document.getElementById('msg-include').value = '';
      $('body').trigger('click');
      return;
    }
    if (e.target.id === 'msg-send-input' && e.target.value !== '') {
      reply();
      return;
    }
  }
})
// event listener: scroll
document.addEventListener('scroll', onScroll);
// on load: check for cookies
window.onload = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/landing/status', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
      wantLanding();
      return;
    }
    if (xhr.status === 240) {
      me = /user=([a-z\d-]+)/i.exec(document.cookie)[1];
      document.getElementById('dropdown').classList.add('hidden');
      document.getElementById('signup').classList.add('hidden');
      document.getElementById('logout').classList.remove('hidden');
      document.getElementById('trending').parentNode.classList.remove('hidden');
      document.getElementById('recommended').parentNode.classList.remove('hidden');
      wantCard(me, 'card', me);
      wantTrends();
      wantRecommended();
      goHome();
      return me;
    }
  })
}
// who is logged in
var me = false;
// for revealing tweets
var showScroll = false;
var remainingLine = [];
var viewing = '';
// semantic
$('.ui.dropdown').dropdown();
