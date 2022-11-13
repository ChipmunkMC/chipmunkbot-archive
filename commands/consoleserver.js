const name = 'consoleserver'
const description = 'sets the console server'
const usages = ['<host...>']
const aliases = ['consoleserver', 'consolesvr', 'csvr']
const enabled = false

const permLevel = 0

function execute (bot, cmd, player, args) {
  const host = args.join(' ')
  bot.getBots().forEach(bot => {
    bot.console.host = host
  })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
