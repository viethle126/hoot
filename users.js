var users = {
  viethle126: {
    password: 'hoot',
    name: 'Viet Le',
    handle: 'viethle126',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  alysiasaquil: {
    password: 'hoot',
    name: 'Alysia Saquilabon',
    handle: 'alysiasaquil',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  ajames91: {
    password: 'hoot',
    name: 'Andrew Velasquez',
    handle: 'ajames91',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  arunpaulgopal: {
    password: 'hoot',
    name: 'Arun Gopal',
    handle: 'arunpaulgopal',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  bgnewuch: {
    password: 'hoot',
    name: 'Benjamin Gnewuch',
    handle: 'bgnewuch',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  brianwalen: {
    password: 'hoot',
    name: 'Brian Walen',
    handle: 'brianwalen',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  metcalfec: {
    password: 'hoot',
    name: 'Chris Metcalfe',
    handle: 'metcalfec',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  coreysl: {
    password: 'hoot',
    name: 'Corey Lin ',
    handle: 'coreysl',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  nanhyunchul: {
    password: 'hoot',
    name: 'Hyun Lee',
    handle: 'nanhyunchul',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  jnguyen: {
    password: 'hoot',
    name: 'Justin Nguyen',
    handle: 'jnguyen',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  little78926: {
    password: 'hoot',
    name: 'John Huang',
    handle: 'little78926',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  mikefield: {
    password: 'hoot',
    name: 'Michael Field',
    handle: 'mikefield',
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
  niralpokal: {
    password: 'hoot',
    name: 'Niral Pokal',
    handle: 'niralpokal',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  ronperris: {
    password: 'hoot',
    name: 'Ron Perris',
    handle: 'ronperris',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  espressohoarder: {
    password: 'hoot',
    name: 'Shlomo Kofman',
    handle: 'espressohoarder',
    tweets: [],
    followers: [],
    following: [],
    notifications: [],
    favorites: [],
    cookies: []
  },
  tputs001: {
    password: 'hoot',
    name: 'Tom Putsawatanachai',
    handle: 'tputs001',
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
