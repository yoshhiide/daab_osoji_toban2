'use strict';

const Admin   = require('./admin');
const Members = require('./members');
const Chosen  = require('./chosen');
const Timers  = require('./timers');

class Model {

  constructor(args) {
    this.admin   = new Admin(args);
    this.members = new Members(args);
    this.chosen  = new Chosen(args);
    this.timers  = new Timers(args);
  }

}

module.exports = Model;
