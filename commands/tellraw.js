const name = 'tellraw'
const description = 'Tellraw command' // '\xa7mUseless\xa7r backwards-compatible tellraw command'
const usages = ['<target> <component (JSON)...>']
const aliases = ['tellraw']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  const target = args.shift()
  bot.tellraw(JSON.parse(args.join(' ').replace(/\xa7.?/g, '')), target)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
