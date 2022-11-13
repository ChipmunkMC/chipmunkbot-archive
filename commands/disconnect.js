const name = 'disconnect'
const description = 'Ends the bot\'s client.'
const usages = []
const aliases = ['disconnect']
const enabled = true

const permLevel = 1

function execute (bot, cmd, player, args, handler) {
  bot.disconnect()
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
