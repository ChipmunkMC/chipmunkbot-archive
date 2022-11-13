const name = 'antitnt'
const description = 'Prevents explosions'
const usages = [
  'on',
  'off'
]
const aliases = ['antitnt', 'antiexplosion']
const enabled = true
const permLevel = 1

function execute (bot, cmd, player, args) {
  function sendState () {
    bot.tellraw([{ text: 'antiTNT is now ', color: bot.colors.primary }, { text: bot.antiTNT.enabled ? 'on' : 'off', color: bot.colors.secondary }])
  }

  const subCommand = args.shift()
  if (subCommand === undefined) {
    throw new Error('ok')
    return
  }
  
  switch (subCommand.toLowerCase()) {
    case 'on':
      bot.antiTNT.enabled = true
      sendState()
      break
    case 'off':
      bot.antiTNT.enabled = false
      sendState()
      break
    default:
      throw new Error('ok')
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
