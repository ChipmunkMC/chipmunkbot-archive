const name = 'wikipedia'
const description = 'Shows summaries of wikipedia pages'
const usages = []
const aliases = ['wikipedia', 'wiki']
const enabled = true
const permLevel = 0

const wiki = require('wikipedia')

async function execute (bot, cmd, player, args) {
  const page = await wiki.page(args.join(' ').replace(/\xa7.?/g, ''))
  const summary = await page.summary()

  bot.tellraw(summary.extract, player.UUID)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
