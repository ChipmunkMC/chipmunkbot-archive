const fs = require('fs')

function inject (bot) {
  bot.runFunction = function (filepath) {
    const commands = fs.readFileSync(filepath).toString().replace(/\r\n?/g, '\n').split('\n')
    let i = 0
    const interval = setInterval(() => {
      if (!commands[i]?.startsWith('#')) { bot.exploits.execute('run ' + commands[i]) }
      if (++i > commands.length) { clearInterval(interval) }
    }, 50)
  }
}

module.exports = inject
