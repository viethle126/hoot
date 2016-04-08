function parse(input) {
  // extract users from a string into an array
  function users(input) {
    var array = input.split(/(@[a-z\d-]+)/);
    var users = [];
    array.forEach(function(element, index, array) {
      if (element.search(/@([a-z\d-]+)/) === 0) {
        users.push(element.slice(1));
      }
    })
    return users;
  }
  // extract users from a string into an array
  function trends(input) {
    var array = input.split(/(#[a-z\d-]+)/);
    var trends = [];
    array.forEach(function(element, index, array) {
      if (element.search(/#([a-z\d-]+)/) === 0) {
        trends.push(element);
      }
    })
    return trends;
  }
  // remove users from a string
  function string(input) {
    var array = input.toLowerCase().split(/(@[a-z\d-]+)/);
    var string = []
    array.forEach(function(element, index, array) {
      if (element[0] === ' ' && element.search(/@([a-z\d-]+)/) === -1) {
        string.push(element.slice(1))
        return;
      }
      if (element.search(/@([a-z\d-]+)/) === -1) {
        string.push(element);
        return;
      }
    })
    string = string.join('');
    return string;
  }

  return {
    users: users,
    string: string
  }
}

module.exports = parse();
