var users = {
  alysia: {
    password: 'hoot',
    name: 'Alysia Saquilabon',
    handle: 'alysia',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  andrew: {
    password: 'hoot',
    name: 'Andrew Velasquez',
    handle: 'andrew',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  arun: {
    password: 'hoot',
    name: 'Arun Gopal',
    handle: 'arun',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  ben: {
    password: 'hoot',
    name: 'Benjamin Gnewuch',
    handle: 'ben',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  brian: {
    password: 'hoot',
    name: 'Brian Walen',
    handle: 'brian',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  chris: {
    password: 'hoot',
    name: 'Chris Metcalfe',
    handle: 'chris',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  corey: {
    password: 'hoot',
    name: 'Corey Lin ',
    handle: 'corey',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  hyun: {
    password: 'hoot',
    name: 'Hyun Lee',
    handle: 'hyun',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  justin: {
    password: 'hoot',
    name: 'Justin Nguyen',
    handle: 'justin',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  john: {
    password: 'hoot',
    name: 'John Huang',
    handle: 'john',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  mike: {
    password: 'hoot',
    name: 'Michael Field',
    handle: 'mike',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
  },
  treezrppl2: {
    password: 'hoot',
    name: 'Nathan Walston',
    handle: 'treezrppl2',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  niral: {
    password: 'hoot',
    name: 'Niral Pokal',
    handle: 'niral',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  ron: {
    password: 'hoot',
    name: 'Ron Perris',
    handle: 'ron',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  shlomo: {
    password: 'hoot',
    name: 'Shlomo Kofman',
    handle: 'shlomo',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  tom: {
    password: 'hoot',
    name: 'Tom Putsawatanachai',
    handle: 'tom',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  viet: {
    password: 'hoot',
    name: 'Viet Le',
    handle: 'viet',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  zane: {
    password: 'hoot',
    name: 'Zane DeFazio',
    handle: 'zane',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
}

users.id = 0;
users.keys = [];

(users.updateKeys = function() {
  users.keys = ['id', 'keys', 'updateKeys', 'check'];
  for (prop in users) {
    if (users.keys.indexOf(prop) === -1) {
      users.keys.push(prop);
    }
  }
  users.keys = users.keys.slice(4);
})();

users.check = function(user) {
  if (users.keys.indexOf(user) !== -1) {
    return true;
  } else {
    return false;
  }
}

module.exports = users;
