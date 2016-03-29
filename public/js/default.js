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

function remove(element, count) {
  if (count > 0) {
    count--;
    element.childNodes[0].remove();
    remove(element, count);
  } else {
    return;
  }
}

function clear(id) {
  var element = document.getElementById(id);
  var count = element.childNodes.length;
  remove(element, count);
}

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
  var retweetLink = document.createElement('a');
  var retweet = elemClass('i', 'retweet icon');
  var favLink = document.createElement('a');
  var fav = elemClass('i', 'heart icon');

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
  timeline.appendChild(item);
}

function wantLine(user, where, homeuser) {
  clear(where);
  var data = { handle: user, home: homeuser }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText).reverse();
    var displayed = tweets.length;
    if (displayed > 50) { displayed = 50 } // show up to 50
    for (var i = 0; i < displayed; i++) {
      addTweet(tweets[i], where);
    }
  })
}

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

  followingLink.appendChild(following);
  followingLink.appendChild(followingText)
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

function resetMenu(array) {
  array.forEach(function(element, index, array) {
    element.setAttribute('data-active', 'false');
    element.classList.remove('active');
  })
}

document.getElementById('menu').addEventListener('click', function(e) {
  var what = e.target
  var menu = document.getElementById('menu').childNodes[1].childNodes;
  var items = [menu[1], menu[3], menu[5], menu[7], menu[9]];
  while (!what.id) {
    what = what.parentNode;
  }
  if (what.id === 'home') {
    var home = items[1];
    var timeline = document.getElementById('your-timeline');
    var visit = document.getElementById('visit-timeline');
    var you = document.getElementById('card');
    var card = document.getElementById('visit-card');

    if (home.getAttribute('data-active') === 'false') {
      resetMenu(items);
      home.setAttribute('data-active', 'true');
      home.classList.add('active');
      timeline.classList.remove('hidden');
      wantLine('viethle126', 'your-timeline', true);
    }
    if (home.getAttribute('data-active') === 'visiting') {
      resetMenu(items);
      home.setAttribute('data-active', 'true');
      home.classList.add('active');
      visit.classList.add('hidden');
      card.classList.add('hidden');
      timeline.classList.remove('hidden');
      you.classList.remove('hidden');
      wantLine('viethle126', 'your-timeline', true);
    } else {
      return;
    }
  }
  if (what.id === 'hoot') {
    var hoot = items[0];
    var segment = document.getElementById('new-hoot');
    var form = document.getElementById('hoot-form');
    if (hoot.getAttribute('data-active') === 'false') {
      resetMenu(items);
      hoot.setAttribute('data-active', 'true');
      hoot.classList.add('active');
      segment.classList.remove('hidden');
      form.classList.remove('hidden');
      return;
    }
    if (hoot.getAttribute('data-active') === 'true') {
      resetMenu(items);
      segment.classList.add('hidden');
      return;
    } else {
      return;
    }
  }
});

document.getElementById('new-hoot').addEventListener('click', function(e) {
  if (e.target.id === 'cancel-hoot') {
    var menu = document.getElementById('menu').childNodes[1].childNodes;
    var items = [menu[1], menu[3], menu[5], menu[7], menu[9]];
    document.getElementById('hoot-content').value = '';
    document.getElementById('new-hoot').classList.add('hidden');
    resetMenu(items);
    return;
  }
  if (e.target.id === 'submit-hoot') {
    var data = {
      content: document.getElementById('hoot-content').value,
      handle: 'viethle126'
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/hoot', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.addEventListener('load', function() {
      document.getElementById('hoot-form').classList.add('hidden');
      document.getElementById('after-hoot').classList.remove('hidden');
      document.getElementById('hoot-content').value = '';
      wantLine('viethle126', 'your-timeline', true);
      setTimeout(function() {
        document.getElementById('new-hoot').classList.add('hidden');
        document.getElementById('after-hoot').classList.add('hidden');
      }, 5000);
    })
  }
})

document.getElementById('visit-card').addEventListener('click', function(e) {
  if (e.target.dataset.followText) {
    var action = e.target.dataset.followText
    var who = e.target.parentNode;
    var follow = e.target.parentNode.childNodes[0];
    var unfollow = e.target.parentNode.childNodes[1];
    while (!who.dataset.cardHandle) {
      who = who.parentNode;
    }
    who = who.getAttribute('data-card-handle');

    if (action === 'Follow') {
      var data = { handle: who, home: 'viethle126' }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/follow', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));

      xhr.addEventListener('load', function() {
        follow.classList.add('hidden');
        unfollow.classList.remove('hidden');
      })
    }
    if (action === 'Unfollow') {
      var data = { handle: who, home: 'viethle126' }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/unfollow', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));

      xhr.addEventListener('load', function() {
        unfollow.classList.add('hidden');
        follow.classList.remove('hidden');
      })
    }
  }
})

// temporary userlist, will move later
document.getElementById('userlist').addEventListener('click', function(e) {
  var list = document.getElementById('userlist');
  var home = document.getElementById('home');
  var yours = document.getElementById('your-timeline');
  var visit = document.getElementById('visit-timeline');
  var you = document.getElementById('card')
  var card = document.getElementById('visit-card');

  var who = e.target;
  while (!who.id) {
    who = who.parentNode;
  }
  home.setAttribute('data-active', 'visiting');
  home.classList.remove('active');
  yours.classList.add('hidden');
  visit.classList.remove('hidden');
  you.classList.add('hidden');
  card.classList.remove('hidden');
  wantLine(who.id, 'visit-timeline', false);
  wantCard(who.id, 'visit-card', 'viethle126');
})

window.onload = function() {
  wantCard('viethle126', 'card', 'viethle126');
}
