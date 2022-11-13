const { parentPort } = require('worker_threads')

const { runInThisContext, Module } = require('vm')
const { inspect } = require('util')
const path = require('path')
const { stylizeWithColor } = require('../../util/stylize_with_color.js')

const plugins = {
  process: require('./plugins/process.js'),
  cjs: require('./plugins/cjs.js')
}

process = null

parentPort.on('message', ({ action, data }) => {
  if (action === 'eval') {
    try {
      let result = runInThisContext(data.code, { filename: 'this is totally a real file' })
      result = data.inspect ? inspect(result, { stylize: stylizeWithColor }) : result

      parentPort.postMessage({ action: 'resolve', data: result })
    } catch (err) {
      err = data.inspect ? inspect(err, { stylize: stylizeWithColor }) : err

      parentPort.postMessage({ action: 'reject', data: err })
    }
  }
})

// plugin injection
Object.values(plugins).forEach(inject => inject())
