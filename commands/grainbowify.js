const name = 'grainbowify'
const description = 'Makes text green rainbow'
const usages = ['<message...>']
const aliases = ['grainbowify']
const enabled = true

const permLevel = 0

const colorsys = require('colorsys')

function execute (bot, cmd, player, args, handler) {
  const message = args.join(' ')

  const result = []
  let val = 0
  let backwards = false
  message.split('').forEach((char) => {
    result.push({ text: char, color: colorsys.hsv2Hex(100, 100, val) })
    incr()
    if (val <= 0 || val >= 100) {
      backwards = !backwards
      incr()
    }

    function incr () {
      const incr = 100 / Math.max(message.length, 20)
      if (!backwards) { val += incr } else { val -= incr }
    }
  })

  bot.tellraw(result)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
