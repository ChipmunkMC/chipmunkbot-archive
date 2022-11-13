const {
  Worker,
//  isMainThread,
  parentPort,
  workerData
} = require('worker_threads')

function bot (bot) {
  bot.eval = function (code, options = {}) {
    return new Promise((resolve, reject) => {
      const listener = ({ action, data }) => {
        if (action === 'resolve') resolve(data)
        else if (action === 'reject') reject(data)
        else return

        bot.eval._worker.removeListener('message', listener)
      }

      bot.eval._worker.on('message', listener)
      bot.eval._worker.postMessage({ action: 'eval', data: { code, ...options } })
    })
  }

  function stdoutListener (data) { bot.tellraw({ text: String(data) }) } // TODO: Make it less broken

  function exitListener (exitCode) {
    if (bot.loggedIn) bot.tellraw([{ text: 'Eval worker exited with code ', color: bot.colors.primary }, { text: exitCode, color: bot.colors.secondary }])

    bot.eval._worker = new Worker(require.resolve('./worker.js'), {
      env: { among: 'us' }
    })
      const worker = bot.eval._worker

      worker.on('message', ({ action, data }) => {
        if (action === 'run') bot.core.run(data)
      })
      worker.stdout.on('data', stdoutListener)
      worker.stderr.on('data', stdoutListener)
      worker.on('error', console.error)
      worker.on('exit', exitListener)
  }
  exitListener(-69)
}

module.exports = { bot }
