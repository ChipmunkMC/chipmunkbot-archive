const _process = require('process')
const Process = _process.constructor

function inject () {
  const process = new Process()
  global.process = process

  process.exit = _process.exit
  process.nextTick = _process.nextTick
}

module.exports = inject
