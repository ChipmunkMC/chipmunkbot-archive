const { hsv2Hex } = require('colorsys')

function bot (bot) {
  bot.bruhify = {
    text: '',
    _format: comp => 'minecraft:title @a actionbar ' + comp
  }
  bot.bruhify.format = bot.bruhify._format

  let startHue = 0
  setInterval(() => {
    const { text, format } = bot.bruhify
    if (!text) return
    
    let hue = startHue
    const increment = (360 / Math.max(text.length, 20)) % 360
    
    const _component = text
      .split('')
      .map(char => {
        const text = { text: char, color: hsv2Hex(hue, 100, 100) }
        hue = (hue + increment) % 360
        return text
      })
      
      bot.core.run(format(JSON.stringify([{ text: '▚ ', color: 'light_purple' }, ..._component, ' ▚'])))
      startHue = (startHue + increment) % 360
  }, 50)
}

module.exports = { bot }