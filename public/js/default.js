function elemAttribute(elem, name, value) {
  var element = document.createElement(elem);
  element.setAttribute(name, value);
  return element;
}

function elemClass(elem, classes) {
  var element = document.createElement(elem);
  element.className = classes;
  return element;
}
// clear child elements
function remove(element, count) {
  if (count > 0) {
    count--;
    element.childNodes[0].remove();
    remove(element, count);
  } else {
    return;
  }
}
// determine how many child elements to remove
function clear(id) {
  var element = document.getElementById(id);
  var count = element.childNodes.length;
  remove(element, count);
}
// login
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
      }, 3000)
    }
  })
}
// logout
function logout() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/logout', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    document.location.reload(true);
  })
}
// search
function search(input) {
  var data = { search: input, home: me }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/search', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var payload = JSON.parse(xhr.responseText);
    console.log(payload);
  })
}
// submit tweet
function tweet() {
  var data = {
    content: document.getElementById('hoot-content').value,
    handle: me
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/hoot', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    wantLine(me, 'your-timeline', me, 'tweets');
    toggle('success');
  })
}
// submit retweet
function retweet() {
  var item = document.getElementById('rehoot-here').childNodes[0];
  var data = {
    content: document.getElementById('hoot-content').value,
    handle: me,
    rehootId: item.getAttribute('data-hoot-id'),
    rehootHandle: item.getAttribute('data-handle')
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addRehoot', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    wantLine(me, 'your-timeline', me, 'tweets');
    toggle('success');
  })
}
// add tweet to timeline
function addTweet(data, where) {
  var timeline = document.getElementById(where);
  var item = elemClass('div', 'item');
  var imageDiv = elemClass('div', 'ui tiny image');
  var image = elemAttribute('img', 'src', 'images/' + data.handle + '.jpg');
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(data.name);
  var meta = elemClass('div', 'meta');
  var span = document.createElement('span');
  var spanText = document.createTextNode('@' + data.handle + ' - ' + data.date);
  var desc = elemClass('div', 'description');
  var para = document.createElement('p');
  var paraText = document.createTextNode(data.content);
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
  header.appendChild(headerText);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  content.appendChild(extra);
  imageDiv.appendChild(image);
  item.appendChild(imageDiv);
  item.appendChild(content);
  item.setAttribute('data-hoot-id', data.id);
  item.setAttribute('data-handle', data.handle);
  timeline.appendChild(item);

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
// request retweet data
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
  xhr.open('POST', '/rehoot', true);
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
// add notes to timeline
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
  //if (data.retweet !== 'None') { timeline.removeChild(container) }
}
// add compact tweets
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
  image.setAttribute('src', 'images/' + data.handle + '.jpg');
  content.appendChild(image);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  card.appendChild(content);
  landing.appendChild(card);
}
// request landing page
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
// request timeline
function wantLine(user, where, homeuser, type) {
  clear(where);
  var data = { handle: user, home: homeuser, type: type }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText).reverse();
    var displayed = tweets.length;
    if (displayed > 50) { displayed = 50 } // show up to 50
    for (var i = 0; i < displayed; i++) {
      if (type !== 'notifications') {
        addTweet(tweets[i], where)
      } else {
        addNote(tweets[i])
      }
    }
  })
}
// create card
function card(data, where) {
  var card = document.getElementById(where);
  var imageDiv = elemClass('div', 'image');
  var image = elemAttribute('img', 'src', 'images/' + data.handle + '.jpg');
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(data.name);
  var meta = elemClass('div', 'meta');
  var handleSpan = elemClass('span', 'date');
  var handleText = document.createTextNode('@' + data.handle);
  var breakLine = document.createElement('br');
  var countSpan = elemClass('span', 'date');
  var write = elemClass('i', 'edit icon icon');
  var writeText = document.createTextNode(data.tweets + ' Hoots');
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

  if (data.handle === me) {
    countSpan = elemClass('a', 'date');
    countSpan.setAttribute('data-hoots', true);
  }
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
  if (data.handle !== data.me) { desc.appendChild(segment) }
  handleSpan.appendChild(handleText);
  countSpan.appendChild(write);
  countSpan.appendChild(writeText);
  meta.appendChild(handleSpan);
  meta.appendChild(breakLine);
  meta.appendChild(countSpan);
  header.appendChild(headerText);
  content.appendChild(header);
  content.appendChild(meta);
  content.appendChild(desc);
  imageDiv.appendChild(image);
  card.appendChild(imageDiv);
  card.appendChild(content);
  card.appendChild(extra);
  card.setAttribute('data-card-handle', data.handle)

  if (data.follow === true) {
    follow.classList.add('hidden');
  } else {
    unfollow.classList.add('hidden');
  }
}
// request card
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
// request followers or following
function wantFollowers(me, where, type) {
  clear(where);
  var data = { me: me, type: type }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/followers', true);
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
// change follow/unfollow state
function follow(target) {
  var target = target;
  if (!target.dataset.followText) {
    target = target.parentNode;
  }
  var action = target.dataset.followText.toLowerCase();
  var who = target.parentNode;
  var follow = target.parentNode.childNodes[0];
  var unfollow = target.parentNode.childNodes[1];
  while (!who.dataset.cardHandle) {
    who = who.parentNode;
  }
  who = who.getAttribute('data-card-handle');
  var data = { handle: who, home: me }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/' + action, true);
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
// add/remove favorites
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
    type = "addFavorite";
    handle = item.getAttribute('data-handle');
  } else {
    type = "removeFavorite";
    handle = me;
  }

  var data = {
    handle: handle,
    id: item.getAttribute('data-hoot-id'),
    home: me
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/' + type, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    if (remove === true) {
      document.getElementById('fav-timeline').removeChild(item);
    }
    if (type === 'addFavorite') {
      heart.setAttribute('class', 'heart icon');
      target.setAttribute('data-fav', 'true');
    } else {
      heart.setAttribute('class', 'empty heart icon');
      target.setAttribute('data-fav', 'false');
    }
  })
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
function activate(item) {
  document.getElementById(item).setAttribute('data-active', 'true');
  document.getElementById(item).classList.add('active');
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
    setTimeout(function() { container.classList.add('hidden') }, 5000);
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
  document.getElementById('your-timeline').classList.add('hidden');
  document.getElementById('your-hoots').classList.add('hidden');
  document.getElementById('visit-timeline').classList.add('hidden');
  document.getElementById('note-timeline').classList.add('hidden');
  document.getElementById('fav-timeline').classList.add('hidden');
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
  var target = target;
  if (!target.dataset.go) {
    target = target.parentNode;
  }
  var type = target.dataset.go
  var who = target;
  while (!who.dataset.cardHandle) {
    who = who.parentNode;
  }
  resetMenu();
  show('following');
  if (card === 'visit-card') {
    wantCard(who.dataset.cardHandle, 'visit-card', me);
  }
  showCard(card);
  wantFollowers(who.dataset.cardHandle, 'following', type)
}
// navigate to your hoots
function goHoots() {
  resetMenu();
  show('your-hoots');
  showCard('card');
  wantLine(me, 'your-hoots', me, 'mine');
}
// navigate home
function goHome() {
  resetMenu();
  activate('home');
  show('your-timeline');
  showCard('card');
  wantLine(me, 'your-timeline', me, 'tweets');
}
// navigate to other timeline
function goVisit(who) {
  resetMenu();
  show('visit-timeline');
  showCard('visit-card');
  wantCard(who.id, 'visit-card', me);
  wantLine(who.id, 'visit-timeline', me, 'tweets');
}
// navigate to notifications
function goNotifications() {
  resetMenu();
  activate('notifications');
  show('note-timeline');
  showCard('card');
  wantLine(me, 'note-timeline', me, 'notifications');
}
// navigate to favorites
function goFavorites() {
  resetMenu();
  activate('favorites');
  show('fav-timeline');
  showCard('card');
  wantLine('favorites', 'fav-timeline', me, 'favorites');
}
// event listener: login
document.getElementById('login').addEventListener('click', login)
// event listener: logout
document.getElementById('logout').addEventListener('click', logout)
// event listener: menu
document.getElementById('menu').addEventListener('click', function(e) {
  var what = e.target;
  while (!what.id) {
    what = what.parentNode;
  }
  if (what.id === 'home' && what.getAttribute('data-active') === 'false') {
    goHome();
    return;
  }
  if (what.id === 'notifications' && what.getAttribute('data-active') === 'false') {
    goNotifications();
    return;
  }
  if (what.id === 'favorites' && what.getAttribute('data-active') === 'false') {
    goFavorites();
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
// event listener: new hoot form
document.getElementById('new-hoot').addEventListener('click', function(e) {
  if (e.target.id === 'cancel-hoot') {
    toggle('close');
  }
  if (e.target.id === 'submit-hoot') {
    tweet();
  }
  if (e.target.id === 'submit-rehoot') {
    retweet();
  }
})
// event listener: your card
document.getElementById('card').addEventListener('click', function(e) {
  if (e.target.dataset.go || e.target.parentNode.dataset.go) {
    goFollowers(e.target, 'card');
  }
  if (e.target.dataset.go || e.target.parentNode.dataset.go) {
    goFollowers(e.target, 'card');
  }
  if (e.target.dataset.hoots || e.target.parentNode.dataset.hoots) {
    goHoots();
  }
})
// event listener: visitor card
document.getElementById('visit-card').addEventListener('click', function(e) {
  if (e.target.dataset.followText || e.target.parentNode.dataset.followText) {
    follow(e.target);
  }
  if (e.target.dataset.go || e.target.parentNode.dataset.go) {
    goFollowers(e.target, 'visit-card');
  }
})
// event listener: following/follower list
document.getElementById('following').addEventListener('click', function(e) {
  if (e.target.dataset.followText || e.target.parentNode.dataset.followText) {
    follow(e.target);
  }
  if (e.target.dataset.go || e.target.parentNode.dataset.go) {
    goFollowers(e.target, 'visit-card');
  }
})

// event listener: home timeline
document.getElementById('your-timeline').addEventListener('click', function(e) {
  if (e.target.dataset.retweet || e.target.parentNode.dataset.retweet) {
    wantRetweet(e.target);
  }
  if (e.target.dataset.fav || e.target.parentNode.dataset.fav) {
    favorite(e.target);
  }
})
// event listener: visit timeline
document.getElementById('visit-timeline').addEventListener('click', function(e) {
  if (e.target.dataset.retweet || e.target.parentNode.dataset.retweet) {
    wantRetweet(e.target);
  }
  if (e.target.dataset.fav || e.target.parentNode.dataset.fav) {
    favorite(e.target);
  }
})
// event listener: notifications
document.getElementById('note-timeline').addEventListener('click', function(e) {
  if (e.target.dataset.retweet || e.target.parentNode.dataset.retweet) {
    wantRetweet(e.target);
  }
  if (e.target.dataset.fav || e.target.parentNode.dataset.fav) {
    favorite(e.target);
  }
})
// event listener: favorites
document.getElementById('fav-timeline').addEventListener('click', function(e) {
  if (e.target.dataset.retweet || e.target.parentNode.dataset.retweet) {
    wantRetweet(e.target);
  }
  if (e.target.dataset.fav || e.target.parentNode.dataset.fav) {
    favorite(e.target, true);
  }
})
// temporary userlist, will move later
document.getElementById('userlist').addEventListener('click', function(e) {
  var who = e.target;
  while (!who.id) {
    who = who.parentNode;
  }
  goVisit(who);
})
// who is logged in
var me = false;
// on load: check for cookies
window.onload = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/check', true);
  xhr.send();

  xhr.addEventListener('load', function() {
    if (xhr.status === 200) {
      wantLanding();
      return;
    }
    if (xhr.status === 240) {
      me = /user=([a-z\d-]+)/.exec(document.cookie)[1];
      document.getElementById('dropdown').classList.add('hidden');
      document.getElementById('logout').classList.remove('hidden');
      activate('home')
      wantCard(me, 'card', me);
      showCard('card');
      wantLine(me, 'your-timeline', me, 'tweets');
      show('your-timeline');
      document.getElementById('userlist').classList.remove('hidden');
      return me;
    }
  })
}
// semantic
$('.ui.dropdown')
  .dropdown()
;
