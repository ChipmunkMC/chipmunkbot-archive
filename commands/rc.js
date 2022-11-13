const name = 'rc'
const description = 'Resets the bot\'s command core'
const usages = []
const aliases = ['rc']
const enabled = true

const permLevel = 0

function execute (bot, cmd, entity, args) {
  bot.core.reset()
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
