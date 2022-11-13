const name = 'rainbowify'
const description = 'Makes text rainbow'
const usages = ['<message...>']
const aliases = ['rainbowify']
const enabled = true

const permLevel = 0

const colorsys = require('colorsys')

function execute (bot, cmd, player, args, handler) {
  const message = args.join(' ')
  let hue = 0

  const rainbowified = message
    .split('')
    .map((char) => {
      const component = { text: char, color: colorsys.hsv2Hex(hue, 100, 100) }
      hue = (hue + (360 / Math.max(message.length, 20))) % 360
      return component
    })

  bot.tellraw(rainbowified)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
