#! /usr/bin/env node

'use strict'

const assert = require('assert')
const parseArgs = require('./args')
const fs = require('fs')
const path = require('path')
const resolveFrom = require('resolve-from')

let Fastify = null
let fastifyPackageJSON = null

function showHelp () {
  console.log(fs.readFileSync(path.join(__dirname, 'help', 'start.txt'), 'utf8'))
  return module.exports.stop()
}

function stop (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  process.exit()
}

function loadModules (opts) {
  try {
    const basedir = path.resolve(process.cwd(), opts.file)

    Fastify = require(resolveFrom.silent(basedir, 'fastify') || 'fastify')
  } catch (e) {
    module.exports.stop(e)
  }
}

function start (args, cb) {
  let opts = parseArgs(args)

  if (!fs.existsSync(opts.file)) {
    console.error("Missing the required file app.js\n")
    return showHelp()
  }

  loadModules(opts)
  return runFastify(args, cb)
}

function runFastify (args, cb) {
  require('dotenv').config()
  let opts = parseArgs(args)

  opts.port = opts.port || process.env.PORT || 3000
  cb = cb || assert.ifError

  loadModules(opts)

  var file = null
  try {
    file = require(path.resolve(process.cwd(), opts.file))
  } catch (e) {
    return module.exports.stop(e)
  }

  console.log(file.constructor.name)
}

function cli (args) {
  start(args)
}

module.exports = { start, runFastify, stop }

if (require.main === module) {
  cli(process.argv.slice(2))
}