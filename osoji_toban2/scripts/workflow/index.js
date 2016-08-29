'use strict';

const Answer   = require('./answer');
const Check    = require('./check');
const Edit     = require('./edit');
const Question = require('./question');
const Send     = require('./send');


class Workflow {

  constructor({ act, model }) {
    const args = { act, model, workflow: this };

    this.answer   = Answer(args);
    this.check    = Check(args);
    this.edit     = Edit(args);
    this.question = Question(args);
    this.send     = Send(args);
  }

}

module.exports = Workflow;
