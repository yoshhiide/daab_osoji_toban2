'use strict';

const Admin    = require('./admin');
const Members  = require('./members');
const Unchosen = require('./unchosen');
const Timers   = require('./timers');

class Model {

  constructor(args) {
    this.admin    = new Admin(args);
    this.members  = new Members(args);
    this.unchosen = new Unchosen(args);
    this.timers   = new Timers(args);
  }

}

module.exports = Model;
