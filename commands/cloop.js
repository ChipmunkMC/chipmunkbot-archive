const name = 'cloop'
const description = 'Loops commands'
const usages = [
  'add <interval> <command...>',
  'remove <index>',
  'list'
]
const aliases = ['cloop']
const enabled = true

const permLevel = 1

function execute (bot, cmd, player, args, handler) {
  const subCommand = args.shift()

  let interval, command, i, msg
  switch (subCommand) {
    case 'add':
      interval = Number(args.shift())
      if (Number.isNaN(interval)) throw new Error('Interval must be a number')

      command = args.join(' ').replace(/xa7.?/g, '')
      bot.cloops.push({ command, interval })

      bot.tellraw([
        { text: 'Added command ', color: bot.colors.primary },
        { text: command, color: bot.colors.secondary },
        ' to cloops.'
      ])
      break
    case 'remove':
      i = Number(args.shift())
      if (Number.isNaN(i)) throw new Error('Index must be a number')
      bot.cloops.splice(i, 1)

      bot.tellraw([
        { text: 'Removed cloop ', color: bot.colors.primary },
        { text: i, color: bot.colors.secondary }
      ])
      break
    case 'list':
      msg = [{ text: 'Cloops: \n', color: bot.colors.primary }]
      for (const i in bot.cloops) {
        msg.push({ text: `${i}: ` })
        msg.push({ text: `${bot.cloops[i].command}\n`, color: bot.colors.secondary })
      }
      bot.tellraw(msg)
      break
    default:
      throw new SyntaxError('Invalid or missing argument' + (subCommand ? ': ' + subCommand : ''))
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
