const name = 'runjson'
const description = 'Runs a command from a JSON string'
const usages = ['<command (JSON)...>']
const aliases = ['runjson']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args) {
  const command = JSON.parse(args
    .join(' ')
    .replace(/\xa7.?/g, '')
  )
  if (typeof command !== 'string') throw new TypeError('command must be a string')

  bot.core.run(command)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
