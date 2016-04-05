var _ = require('underscore');
var timestamp = require('./timestamp.js');
// end modules
var id = 0;
var convo = [];
// start new conversation
convo.new = function(who) {
  users = _.sortBy(who);
  var add = {
    id: id,
    users: users,
    messages: [],
    last: timestamp.military()
  }
  convo.push(add);
  id++
  return id;
}
// return id
convo.id = function() {
  return id;
}
// invite a user to a conversation
convo.invite = function(who, id) {
  convo[id].users.push(who);
  convo[id].users = _.sortBy(convo[id].users);
  var update = {
    user: 'hoot',
    date: timestamp.civilian(),
    content: '@' + who + ' has been added to the conversation.'
  }
  convo[id].messages.push(update);
  convo[id].last = timestamp.military();
}
// leave a conversation
convo.leave = function(who, id) {
  convo[id].users.splice(convo[id].users.indexOf(who), 1);
  var update = {
    user: 'hoot',
    date: timestamp.civilian(),
    content: '@' + who + ' has left the conversation.'
  }
  convo[id].messages.push(update);
  convo[id].last = timestamp.military();
}
// list a user's conversations
convo.list = function(who) {
  var list = [];
  convo.forEach(function(element, index, array) {
    if (element.users.indexOf(who) !== -1) {
      list.push(element);
    }
  })
  list = _.sortBy(list, 'last');
  return list;
}
// get messages from a conversation
convo.get = function(id) {
  return convo[id].messages;
}
// send message to a conversation
convo.send = function(data) {
  var add = {
    user: data.user,
    date: timestamp.civilian(),
    content: data.content
  }
  convo[data.id].messages.push(add);
  convo[data.id].last = timestamp.military();
}

module.exports = convo;
