const name = 'parsetest'
const description = 'Displays a chat message (can be colored with %)'
const usages = ['<message...>']
const aliases = ['parsetest']
const enabled = true
const permLevel = 0

const parseString = require('../util/bukkit_chat_parse.js')

function execute (bot, cmd, player, args, handler) {
  const message = args.join(' ').replace(/%[0123456789a-fk-orx]/gi, m => '\xa7' + m[1])
  parseString(message, false, false).forEach(m => bot.tellraw(m))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
