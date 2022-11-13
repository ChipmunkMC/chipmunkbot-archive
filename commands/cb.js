const name = 'cb'
const description = 'Runs a command in the command core'
const usages = ['<command...>']
const aliases = ['cb']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args) {
  bot.core.run(args.join(' '))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
