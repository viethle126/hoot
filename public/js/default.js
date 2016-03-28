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

function addTweet(user, details, tweet) {
  var timeline = document.getElementById('your-timeline');
  var item = elemClass('div', 'item');
  var imageDiv = elemClass('div', 'ui tiny image');
  var image = elemAttribute('img', 'src', 'images/viethle126.jpg');
  var content = elemClass('div', 'content');
  var header = elemClass('div', 'header');
  var headerText = document.createTextNode(user);
  var meta = elemClass('div', 'meta');
  var span = document.createElement('span');
  var spanText = document.createTextNode(details);
  var desc = elemClass('div', 'description');
  var para = document.createElement('p');
  var paraText = document.createTextNode(tweet);
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
  var data = { handle: 'viethle126' }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/timeline', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var tweets = JSON.parse(xhr.responseText);
    tweets.forEach(function(element, index, array) {
      addTweet(tweets[index].name, tweets[index].meta, tweets[index].content);
    })
  })
}

document.getElementById('menu').addEventListener('click', function(e) {
  if (e.target.id === 'home' || e.target.parentNode.id === 'home') {
    console.log('Clicked');
    var home = document.getElementById('home');
    if (home.getAttribute('data-active') === 'false') {
      home.setAttribute('data-active', 'true');
      home.classList.add('active');
      wantLine();
    } else {
      return;
    }
  }
});
