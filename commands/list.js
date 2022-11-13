const name = 'list'
const description = 'Lists Entities (test command)'
const usages = ['[target]']
const aliases = ['list']
const enabled = true
const permLevel = 0

const parseSelectorComponent = require('../util/parse-selector-component.js')

async function execute (bot, cmd, player, args, handler) {
  const selector = args.join(' ').replace(/\xa7.?/g, '') || '@e'
  const entities = parseSelectorComponent((await bot.resolveComponent({ selector }))[0])

  bot.tellraw([
    { text: 'Entities - ', color: bot.colors.primary },
    ...entities.flatMap((e, i) => [{ ...e.name, color: (i % 2) ? bot.colors.primary : bot.colors.secondary }, ' '])
  ])
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
