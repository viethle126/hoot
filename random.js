var users = require('./users.js');
var keys = [];
(function addKeys(array, obj) {
  for (prop in obj) {
    if (array.indexOf(prop) === -1) { array.push(prop) }
  }
  return array;
})(keys, users);

function random() {
  var ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor.'.split(' ');
  var now = new Date();
  var nowDate = now.getDate();
  var nowHours = now.getHours();
  var nowMinutes = now.getMinutes();

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

  function content() {
    var start = Math.floor(Math.random() * 380);
    var length = Math.floor(Math.random() * 15) + 6;
    return cut(start, length);
  }

  function month() {
    return Math.floor(Math.random() * 3) + 1;
    // change to * 4 when April starts
  }

  function day(month) {
    if (month === 1) { return Math.floor(Math.random() * 30) + 1 }
    if (month === 2) { return Math.floor(Math.random() * 28) + 1 }
    if (month === 3) { return Math.floor(Math.random() * 30) + 1 }
    // will add when April starts
    //if (month === 4) { return Math.floor(Math.random() * (nowDate - 1)) + 1 }
  }

  function time(hourRange) {
    var hours = Math.floor(Math.random() * hourRange - 1) + 1;
    var minutes = Math.floor(Math.random() * nowMinutes - 1) + 1;
    var ampm = '';
    if (hours === 0) { ampm = 'am'; hours = 12 }
    if (hours < 12) { ampm = 'am' }
    if (hours === 12) { ampm = 'pm' }
    if (hours > 12) { ampm = 'pm'; hours -= 12 }
    if (minutes < 10) { minutes = '0' + minutes }
    return hours + ':' + minutes + ampm;
  }

  function date() {
    var randomMonth = month();
    var randomDay = day(randomMonth);
    var randomTime = '';
    if (randomDay === now.getDate()) { randomTime = time(nowHours) }
    else { randomTime = time(24) }
    return randomMonth + '/' + randomDay + '/' + 2016 + ' ' + randomTime;
  }

  function tweet(who, quantity) {
    quantity--
    users[who].tweets.push({
      user: who,
      date: date(),
      content: content(),
      tags: [],
      mentions: [],
      retweet: []
    })
    if (quantity > 0) { tweet(who, quantity) }
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

  function begin() {
    for (prop in users) {
      var quantity = Math.floor(Math.random() * 30) + 20;
      var count = Math.floor(Math.random() * 10) + 6;
      var clone = keys.slice();
      clone.splice(clone.indexOf(prop), 1);
      tweet(prop, quantity);
      follow(prop, clone, count);
    }
  }

  return {
    begin: begin,
  }
}

module.exports = random();