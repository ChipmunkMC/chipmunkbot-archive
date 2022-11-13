const name = 'bruhify'
const description = 'recyclebot'
const usages = ['<text>']
const aliases = ['bruhify']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  if (args[0] === 'format') {
    args.shift()
    const code = args.join(' ').replace(/\xa7.?/g, '')
    const format = code ? bot.eval(code) : bot.bruhify._format

    if (typeof format !== 'function') throw new TypeError('format must be a function')

    bot.bruhify.format = format
    return
  }
  bot.bruhify.text = args.join(' ').replace(/\xa7.?/g, '')
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
