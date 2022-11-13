const name = 'lock'
const description = 'real'
const usages = ['add <username>', 'remove <username>']
const aliases = ['lock']
const enabled = false
const permLevel = 1

const nbt = require('prismarine-nbt')

function execute (bot, cmd, player, args, handler) {
  const subCommand = args.shift()?.toLowerCase()
  const username = args.join(' ').replace(/\xa7.?/g, '')

  switch (subCommand) {
    case 'add':
      bot.locked.push(username)
      bot.tellraw([{ text: 'Added ', color: bot.colors.primary }, { text: username, color: bot.colors.secondary }, ' to the lock list'])
      break
    case 'remove':
      const index = bot.locked.indexOf(username)
      if (index === -1) {
        throw new ReferenceError(username + ' is not locked')
      }
      
      // TODO: Unlock them
      
      bot.locked.splice(index, 1)
      bot.tellraw([{ text: 'Removed ', color: bot.colors.primary }, { text: username, color: bot.colors.secondary }, ' from the lock list'])
      break
    default:
      throw new SyntaxError('ok')
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
