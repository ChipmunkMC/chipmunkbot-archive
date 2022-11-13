const name = 'validate'
const description = 'Tests trusted hash validation.'
const usages = ['<hash>']
const aliases = ['validate']
const enabled = true

const permLevel = 1

function execute (bot, cmd, player, args) {
  bot.tellraw({ text: 'Valid hash', color: bot.colors.primary })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
