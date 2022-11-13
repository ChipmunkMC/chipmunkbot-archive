const name = 'kbwl'
const description = 'kaboom whitelist real'
const usages = ['enable', 'disable', 'add <player>', 'remove <player>', 'list']
const aliases = ['kbwl']
const enabled = true
const permLevel = 1

function execute (bot, cmd, player, args) {
  switch (args.shift()) {
    case 'enable':
      bot.kbwl.players.push(player.name)
      bot.kbwl.enabled = true
      bot.tellraw([{ text: 'Enabled KBWL Mode', color: bot.colors.primary }], player.UUID)
      break
    case 'disable':
      bot.kbwl.enabled = false
      bot.tellraw([{ text: 'Disabled KBWL Mode', color: bot.colors.primary }], player.UUID)
      break
    case 'add': {
      const username = args.join(' ')
      if (bot.kbwl.players.includes(username)) throw new Error(username + ' is already whitelisted')
      bot.kbwl.players.push(username)
      bot.tellraw([{ text: 'Added ', color: bot.colors.primary }, { text: username, color: bot.colors.secondary }, 'to the whitelist'], player.UUID)
    } break
    case 'remove': {
      const username = args.join(' ')
      const index = bot.kbwl.players.indexOf(username)
      if (index === -1) throw new Error(username + ' is not whitelisted')
      bot.kbwl.players.splice(index, 1)
      bot.tellraw([{ text: 'Removed ', color: bot.colors.primary }, { text: username, color: bot.colors.secondary }, 'from the whitelist'], player.UUID)
    } break
    case 'list':
      bot.tellraw([
        { text: 'Players - ', color: bot.colors.primary },
        ...bot.kbwl.players.map((username, i) => ({ text: username + ' ', color: i % 2 === 0 ? bot.colors.secondary : bot.colors.primary }))
      ], player.UUID)
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
