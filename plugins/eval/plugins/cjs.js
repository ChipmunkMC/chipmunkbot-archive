const { Module } = require('../util/module.js')

function inject () {
  global.module = new Module('<eval>')
}

module.exports = inject
