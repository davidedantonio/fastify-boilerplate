'use strict'

const assert = require('assert')

let Fastify = null

function loadModules (opts) {
  try {
    const basedir = path.resolve(process.cwd(), opts._[0])

    Fastify = require(resolveFrom.silent(basedir, 'fastify') || 'fastify')
    fastifyPackageJSON = require(resolveFrom.silent(basedir, 'fastify/package.json') || 'fastify/package.json')
  } catch (e) {
    module.exports.stop(e)
  }
}

function runFastify (args, cb) {
  require('dotenv').config()
  let opts = parseArgs(args)
  opts.port = opts.port || process.env.PORT || 3000
  cb = cb || assert.ifError

  loadModules(opts)

  var file = null
  try {
    file = require('./app.js')
  } catch (e) {
    return module.exports.stop(e)
  }
}

module.exports = runFastify