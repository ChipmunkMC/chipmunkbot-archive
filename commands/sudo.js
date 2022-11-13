const name = 'sudo'
const description = 'Forces a player to send a chat message'
const usages = ['<target> <command>', '<target> c:<message>']
const aliases = ['sudo']
const enabled = true
const permLevel = 1

function execute (bot, cmd, player, args) {
  let target = args.shift()
  if (!target) throw new Error('Expected a target')

  let command = args.join(' ').replace(/\xa7.?/g, '')
  if (!command) throw new Error('Expected a command to run')
  if (command.startsWith('c:/')) command = command.substring(3)

  if (bot.server.isAyunBoom && (target === '*' || target === '**')) {
    // Object.values(bot.players).forEach(({ UUID }) => bot.core.run('essentials:sudo ' + UUID + ' ' + command))
    // return
    target = ' ' + target
  }
  bot.core.run('essentials:sudo ' + target + ' ' + command)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
