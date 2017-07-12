'use strict';

//Note!:Please set set below environment variable before run
//export INFOBIP_FROM="my value"
//export INFOBIP_USERNAME="my value"
//export INFOBIP_PASSWORD="my value"
//export INFOBIP_TEST_RECEIVER="my value"

//dependencies
const path = require('path');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const infobip = require(path.join(__dirname, '..', '..'));
infobip.options = {
  from: process.env.INFOBIP_FROM,
  username: process.env.INFOBIP_USERNAME,
  password: process.env.INFOBIP_PASSWORD
};
const Message = mongoose.model('Message');

describe('infobip', function () {

  before(function () {
    infobip.start();
  });

  it('should be able to queue message in live mode', function (done) {

    const details = {
      to: process.env.INFOBIP_TEST_RECEIVER,
      body: 'open311-infobip test'
    };

    Message._queue.on('message:queue:error', function (error) {
      done(error);
    });

    Message._queue.on('message:queue:success', function (message) {
      expect(message).to.exist;
      expect(message.to).to.include(details.to);
      expect(message.body).to.be.equal(details.body);
      expect(message.result).to.not.exist;
    });

    infobip._queue.on('message:sent:error', function (error) {
      done(error);
    });

    infobip._queue.on('message:sent:success', function (message) {
      expect(message).to.exist;
      expect(message.to).to.be.include(details.to);
      expect(message.body).to.be.equal(details.body);
      expect(message.result).to.exist;
    });

    const message = new Message(details);

    infobip.queue(message);

    expect(message.transport).to.exist;
    expect(message.transport).to.be.equal(infobip.transport);
    expect(message.queueName).to.exist;
    expect(message.queueName).to.be.equal(infobip.queueName);

    //wait for queueing processes
    setTimeout(done, 8000);

  });

  it('should be able to send message', function (done) {

    const details = {
      to: process.env.INFOBIP_TEST_RECEIVER,
      body: 'open311-infobip test'
    };

    const message = new Message(details);

    infobip.send(message, function (error, result) {

      expect(error).to.not.exist;
      expect(result).to.exist;

      expect(result.message).to.exist;
      expect(result.message).to.be.equal('success');

      // expect(result.bulkId).to.exist;
      expect(result.messages).to.exist;

      done();

    });

  });

  after(function (done) {
    infobip.stop(done);
  });

});
