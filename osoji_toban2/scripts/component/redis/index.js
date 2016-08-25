'use strict';

const Admin    = require('./redis-admin');
const Members  = require('./redis-members');
const Unchosen = require('./redis-unchosen');
const Timers   = require('./redis-timers');

class Redis {

  constructor(robot) {
    this.admin    = new Admin(robot);
    this.memebers = new Members(robot);
    this.unchosen = new Unchosen(robot);
    this.timers   = new Timers(robot);
  }

}

module.exports = Redis;
