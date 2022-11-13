const name = 'execute'
const description = 'Very normal execute command :)'
const usages = [ // TODO: Improve
  'align <axes> -> execute',
  'anchored <anchor> -> execute',
  '/execute as <targets> -> execute',
  'at <targets> -> execute',
  'facing (entity|<pos>)',
  'if (block|blocks|data|entity|predicate|score)',
  'in <dimension> -> execute',
  'positioned (as|<pos>)',
  'rotated (as|<rot>)',
  'run ...',
  'store (result|success)',
  'unless (block|blocks|data|entity|predicate|score)'
]
const aliases = ['execute']
const enabled = true
const permLevel = 1

function execute (bot, cmd, player, args) {
  if (!bot.execute) throw new Error('Execute is not supported by the bot')

  bot.execute(`as ${player.UUID} at @s ${args.join(' ')}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
