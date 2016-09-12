'use strict';

const Answer   = require('./answer');
const Check    = require('./check');
const Edit     = require('./edit');
const Question = require('./question');
const Message  = require('./message');


class Workflow {

  constructor({ act, model }) {
    const args = { act, model, workflow: this };

    this.answer   = new Answer(args);
    this.check    = new Check(args);
    this.edit     = new Edit(args);
    this.question = new Question(args);
    this.message  = new Message(args);
  }

}

module.exports = Workflow;
