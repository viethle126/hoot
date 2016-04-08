var users = {
  alysia: {
    password: 'hoot',
    name: 'Alysia Saquilabon',
    handle: 'alysia',
    image: 'images/alysia.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  andrew: {
    password: 'hoot',
    name: 'Andrew Velasquez',
    handle: 'andrew',
    image: 'images/andrew.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  arun: {
    password: 'hoot',
    name: 'Arun Gopal',
    handle: 'arun',
    image: 'images/arun.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  ben: {
    password: 'hoot',
    name: 'Benjamin Gnewuch',
    handle: 'ben',
    image: 'images/ben.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  brian: {
    password: 'hoot',
    name: 'Brian Walen',
    handle: 'brian',
    image: 'images/brian.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  chris: {
    password: 'hoot',
    name: 'Chris Metcalfe',
    handle: 'chris',
    image: 'images/chris.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  corey: {
    password: 'hoot',
    name: 'Corey Lin ',
    handle: 'corey',
    image: 'images/corey.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  hyun: {
    password: 'hoot',
    name: 'Hyun Lee',
    handle: 'hyun',
    image: 'images/hyun.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  justin: {
    password: 'hoot',
    name: 'Justin Nguyen',
    handle: 'justin',
    image: 'images/justin.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  john: {
    password: 'hoot',
    name: 'John Huang',
    handle: 'john',
    image: 'images/john.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  mike: {
    password: 'hoot',
    name: 'Michael Field',
    handle: 'mike',
    image: 'images/mike.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  treezrppl2: {
    password: 'hoot',
    name: 'Nathan Walston',
    handle: 'treezrppl2',
    image: 'images/treezrppl2.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  niral: {
    password: 'hoot',
    name: 'Niral Pokal',
    handle: 'niral',
    image: 'images/niral.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  ron: {
    password: 'hoot',
    name: 'Ron Perris',
    handle: 'ron',
    image: 'images/ron.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  shlomo: {
    password: 'hoot',
    name: 'Shlomo Kofman',
    handle: 'shlomo',
    image: 'images/shlomo.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  tom: {
    password: 'hoot',
    name: 'Tom Putsawatanachai',
    handle: 'tom',
    image: 'images/tom.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  viet: {
    password: 'hoot',
    name: 'Viet Le',
    handle: 'viet',
    image: 'images/viet.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
  },
  zane: {
    password: 'hoot',
    name: 'Zane DeFazio',
    handle: 'zane',
    image: 'images/zane.jpg',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: [],
    alerts: 0
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
