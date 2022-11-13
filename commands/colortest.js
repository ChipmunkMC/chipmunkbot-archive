const name = 'colortest'
const description = 'Sends the arguments with \\u00a7 escaped'
const usages = ['<message...>']
const aliases = ['colortest']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  bot.tellraw({ text: args.join(' ').replace(/\xa7/g, '\\u00a7') }, player.UUID)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
