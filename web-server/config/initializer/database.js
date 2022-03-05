'use strict'

const mongoose = require('mongoose')
const IoRedis = require('ioredis')
const config = require('config')
mongoose.Promise = require('bluebird')

const mongoConfigs = config.get('database.mongodb')
const redisConfigs = config.get('database.redis')

let dbs = new Map()

function createMongodbConnection (url, options = {}) {
  const db = mongoose.createConnection(url, options)

  db.on('error', err => {
    err.message = `[mongoose]${err.message}`
    console.error(err)
  })

  db.on('disconnected', () => {
    console.error(`[mongoose] ${url} disconnected`)
  })

  db.on('connected', () => {
    console.info(`[mongoose] ${url} connected successfully`)
  })

  db.on('reconnected', () => {
    console.info(`[mongoose] ${url} reconnected successfully`)
  })
  return db
}

function createRedisConnection (config) {
  const redis = new IoRedis({
    port: config.port,
    host: config.host,
    password: config.password
  });

  redis.on('ready', function () {
    console.info(`[redis]redis ready: ${config.host}:${config.port}`);
  });

  redis.on('reconnecting', function () {
      console.info(`[redis]reconnecting redis: ${config.host}:${config.port}`);
  });

  redis.on('connect', function () {
      console.info(`[redis]connecting redis: ${config.host}:${config.port}`);
  });

  redis.on('error', function (err) {
      console.error('[redis]redis error: ', err);
  });

  return redis
}

// for (let c of mongoConfigs) {
//   dbs.set(c.name, createMongodbConnection(c.url, c.options))
// }

// for (let c of redisConfigs) {
//   dbs.set(c.name, createRedisConnection(c))
// }


module.exports = dbs
