const name = 'myuser'
const description = 'Shows your username'
const usages = []
const aliases = ['myuser']
const enabled = true
const permLevel = 0

function execute (bot, cmd, player, args) {
  bot.tellraw([
    { text: 'Your username is: ', color: bot.colors.primary },
    { text: player.name, color: bot.colors.secondary }
  ])
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
