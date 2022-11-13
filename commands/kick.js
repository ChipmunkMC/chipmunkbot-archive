const name = 'kick'
const description = 'Kicks a player'
const usages = [ // TODO: Improve
  '<target>'
]
const aliases = ['kick']
const enabled = true
const permLevel = 1

function execute (bot, cmd, player, args) {
  if (!bot.kick) throw new Error('Kicking is not supported by the bot')

  bot.kick(args.join(' '))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
