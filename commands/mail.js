const name = 'mail'
const description = 'Shows mail'
const usages = ['send <username> <message>', 'list', 'clear']
const aliases = ['mail']
const enabled = false

const permLevel = 0

function execute (bot, cmd, player, args) {
  const subCmd = args.shift()

  switch (subCmd) {
    case 'send': {
      const u = args.shift()
      const message = args.join(' ')
      bot.sendMail(player.name, bot.players[u].name ?? u, message)
      bot.tellraw([
        { text: 'Sent ', color: bot.colors.primary },
        { text: message, color: bot.colors.secondary },
        ' to ',
        { text: u, color: bot.colors.secondary },
        '.'
      ], player.UUID)
    } break
    case 'list': {
      const messages = bot.mail[player.name]
      if (!messages || messages.length < 1) {
        bot.tellraw({ text: 'You have no mail', color: bot.colors.primary }, player.UUID)
        return
      }
      const msg = [{ text: 'Mail:', color: bot.colors.primary }]
      messages.forEach(message => {
        msg.push(`\n${message.sender} (from ${message.host}): `)
        msg.push({ text: message.message, color: bot.colors.secondary })
      })

      bot.tellraw(msg, player.UUID)
    } break
    case 'clear': {
      bot.mail[player.name].splice(0, bot.mail[player.name].length)
      bot.tellraw({ text: 'Your mail has been cleared.', color: bot.colors.primary }, player.UUID)
    } break
    default: {
      throw new SyntaxError('TODO: add correct error message')
    }
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
