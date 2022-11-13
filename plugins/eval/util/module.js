const _Module = require('module')

const _builtinModules = {
  aasert: require('assert'),
  buffer: require('buffer'),
  console: require('console'),
  crypto: require('crypto'),
  events: require('events'),
  vm: require('vm'),

  'minecraft-protocol': require('minecraft-protocol')
}

class Module {
  id = ''
  path = '.'
  exports = {}
  filename = null
  loaded = false
  children = []

  constructor (path) {
    this.id = path
  }

  require (filepath) {
    if (filepath in _builtinModules) return _builtinModules[filepath]
    throw new Error('i will add that whenever i finish the fake fs')
  }
}

module.exports = { Module, _builtinModules }
