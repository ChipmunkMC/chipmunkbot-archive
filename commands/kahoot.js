const name = 'kahoot'
const description = 'kahoot client lol'
const usages = ['join <pin> <username>', 'leave', 'answer <answer>']
const aliases = ['kahoot']
const enabled = false
const permLevel = 0

function execute (bot, cmd, player, args) {
  const subCmd = args.shift()
  switch (subCmd) {
    case 'join':
      bot.kahoot.join(parseFloat(args.shift()), args.join(' '))
      break
    case 'leave':
      bot.kahoot.leave()
      break
    case 'answer':
      bot.kahoot.answer(parseFloat(args.join(' ')))
      break
    default:
      throw new Error('Invalid or missing argument.')
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
