'use strict';

process.env.NODE_ENV = 'test';

//dependencies
const async = require('async');
const mongoose = require('mongoose');
const kue = require('kue');
require('open311-messages')();

//redis client for database cleanups
const redis = kue.redis.createClientFactory({
  redis: {}
});

mongoose.Promise = global.Promise;

before(function (done) {
  //setup database
  mongoose.connect('mongodb://localhost/open311-infobip', done);
});


/**
 * @description wipe all mongoose model data and drop all indexes
 */
function wipe(done) {
  var cleanups = mongoose.modelNames()
    .map(function (modelName) {
      //grab mongoose model
      return mongoose.model(modelName);
    })
    .map(function (Model) {
      return async.series.bind(null, [
        //clean up all model data
        Model.remove.bind(Model),
        //drop all indexes
        Model.collection.dropAllIndexes.bind(Model.collection)
      ]);
    });

  //run all clean ups parallel
  async.parallel(cleanups, done);
}

/**
 * @description clean up a database
 */
function cleanup(done) {
  redis
    .keys('q*', function (error, rows) {
      if (error) {
        done(error);
      } else {
        async.each(rows, function (row, next) {
          redis.del(row, next);
        }, done);
      }
    });
}

//cleanup redis after each test
afterEach(function (done) {
  cleanup(done);
});

//clean database
after(function (done) {
  async.parallel([wipe, cleanup], function (error) {
    if (error && error.message !== 'ns not found') {
      done(error);
    } else {
      done(null);
    }
  });
});