const name = 'actionbar'
const description = 'exists for some reason'
const usages = ['<message...>']
const aliases = ['actionbar']
const enabled = true
const permLevel = 0

function execute (bot, cmd, player, args) {
  const text = args.join(' ')
  bot.core.run('minecraft:title @a actionbar ' + JSON.stringify({ text }))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
