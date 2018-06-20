'use strict';

//dependencies
const path = require('path');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const faker = require('faker');
const infobip = require(path.join(__dirname, '..', '..'));
const Message = mongoose.model('Message');

describe('infobip', function () {

  beforeEach(function () {
    infobip.options = {
      from: faker.phone.phoneNumber(), //fake sender id
      username: faker.random.uuid(), //fake username
      password: faker.random.uuid(), //fake passweord
      fake: true, //use fake transport
      sync: false, //use sync transport
    };
  });

  it('should be an object', function (done) {
    expect(infobip).to.not.be.null;
    expect(infobip).to.be.an('object');
    done();
  });

  it('should have queue name', function (done) {
    expect(infobip.queueName).to.exist;
    expect(infobip.queueName).to.be.equal('infobip');
    done();
  });

  it('should be able to queue message', function (done) {

    const details = {
      from: faker.phone.phoneNumber(),
      to: faker.phone.phoneNumber(),
      body: faker.lorem.sentence()
    };
    const message = new Message(details);

    infobip.queue(message);

    //assert no queue initialized
    expect(infobip._queue).to.not.be.null;
    expect(infobip.options.sync).to.be.false;

    expect(message.transport).to.exist;
    expect(message.transport).to.be.equal(infobip.transport);
    expect(message.queueName).to.exist;
    expect(message.queueName).to.be.equal(infobip.queueName);

    done();

  });

  it('should be able to simulate message send', function (done) {
    const details = {
      from: faker.phone.phoneNumber(),
      to: faker.phone.phoneNumber(),
      body: faker.lorem.sentence(),
      options: {
        fake: true
      }
    };
    const message = new Message(details);

    infobip.send(message, function (error, result) {

      //assert no queue initialized
      expect(infobip._queue).to.not.be.null;
      expect(infobip.options.sync).to.be.false;

      expect(error).to.not.exist;
      expect(result).to.exist;

      expect(result.message).to.exist;
      expect(result.message).to.be.equal('success');

      done();

    });

  });

  it('should be able to simulate fake transport send', function (done) {
    const details = {
      from: faker.phone.phoneNumber(),
      to: faker.phone.phoneNumber(),
      body: faker.lorem.sentence()
    };
    const message = new Message(details);

    infobip.send(message, function (error, result) {

      //assert no queue initialized
      expect(infobip._queue).to.not.be.null;
      expect(infobip.options.sync).to.be.false;

      expect(error).to.not.exist;
      expect(result).to.exist;

      expect(result.message).to.exist;
      expect(result.message).to.be.equal('success');

      // expect(result.bulkId).to.exist;
      expect(result.messages).to.exist;

      done();

    });

  });

  describe('sync', function () {

    beforeEach(function () {
      infobip.options = {
        from: faker.phone.phoneNumber(), //fake sender id
        username: faker.random.uuid(), //fake username
        password: faker.random.uuid(), //fake passweord
        fake: true, //use fake transport
        sync: true, //use sync transport
      };
    });

    it('should be able to simulate fake sync transport send',
      function (done) {

        const details = {
          from: faker.phone.phoneNumber(),
          to: faker.phone.phoneNumber(),
          body: faker.lorem.sentence()
        };
        const message = new Message(details);

        infobip.send(message, function (error, result) {

          //assert no queue initialized
          expect(infobip._queue).to.be.undefined;
          expect(infobip.options.sync).to.be.true;

          expect(error).to.not.exist;
          expect(result).to.exist;

          expect(result.message).to.exist;
          expect(result.message).to.be.equal('success');

          // expect(result.bulkId).to.exist;
          expect(result.messages).to.exist;

          done();

        });

      });

  });

  afterEach(function (done) {
    infobip.stop(done);
  });

});