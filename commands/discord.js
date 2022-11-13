const name = 'discord'
const description = 'totally real discord command!11'
const usages = []
const aliases = ['discord']
const enabled = true
const permLevel = 0

function execute (bot, cmd, player, args) {
  bot.tellraw([
    { text: 'Join the ', color: 'gray' },
    { text: 'totally real ChipmunkBot Discord', color: bot.colors.primary },
    ' at ',
    { text: 'https://discord.gg/asIwmNwC', color: bot.colors.primary, underlined: true, clickEvent: { action: 'open_url', value: 'https://sus.red' } }
  ])
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
