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
  var retweet = elemClass('i', 'retweet icon');
  var fav = elemClass('i', 'heart icon');

  extra.appendChild(retweet);
  extra.appendChild(fav);
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
  timeline.appendChild(item);
}

function wantLine(user, where) {
  clear(where);
  var data = { handle: user }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText);
    console.log(tweets[0]);
    tweets.reverse().forEach(function(element, index, array) {
      addTweet(tweets[index], where);
    })
  })
}

document.getElementById('menu').addEventListener('click', function(e) {
  if (e.target.id === 'home' || e.target.parentNode.id === 'home') {
    var home = document.getElementById('home');
    var yours = document.getElementById('your-timeline');
    var visit = document.getElementById('visit-timeline');

    if (home.getAttribute('data-active') === 'false') {
      home.setAttribute('data-active', 'true');
      home.classList.add('active');
      wantLine('viethle126', 'your-timeline');
    }
    if (home.getAttribute('data-active') === 'visiting') {
      home.setAttribute('data-active', 'true');
      home.classList.add('active');
      visit.classList.add('hidden');
      yours.classList.remove('hidden');
    } else {
      return;
    }
  }
});

// testing timeline function when visiting other users' timelines
document.getElementById('visit').addEventListener('click', function(e) {
  var home = document.getElementById('home');
  var yours = document.getElementById('your-timeline');
  var visit = document.getElementById('visit-timeline');
  home.setAttribute('data-active', 'visiting');
  home.classList.remove('active');
  yours.classList.add('hidden');
  visit.classList.remove('hidden');
  wantLine('espressohoarder', 'visit-timeline');
});
