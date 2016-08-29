'use strict';

const RedisAdmin    = require('./redis-admin');
const RedisMembers  = require('./redis-members');
const RedisUnchosen = require('./redis-unchosen');
const RedisTimers   = require('./redis-timers');

class Redis {

  constructor(args) {
    this.admin    = new RedisAdmin(args);
    this.memebers = new RedisMembers(args);
    this.unchosen = new RedisUnchosen(args);
    this.timers   = new RedisTimers(args);
  }

}

module.exports = Redis;
