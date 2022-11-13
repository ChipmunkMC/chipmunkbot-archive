const name = 'resolve'
const description = 'Resolves a text component' // '\xa7mUseless\xa7r backwards-compatible tellraw command'
const usages = ['<component (JSON)...>']
const aliases = ['resolve']
const enabled = true

const permLevel = 0

async function execute (bot, cmd, player, args, handler) {
  const component = JSON.parse(args.join(' ').replace(/\xa7.?/g)
  const resolved = await bot.resolveComponent(component)

  bot.tellraw(JSON.stringify(resolved))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
