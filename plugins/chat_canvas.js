const { Canvas } = require('canvas')
const convertImageData = require('../util/image_data_converter.js')
const { states } = require('minecraft-protocol')

function bot (bot) {
  const canvas = new Canvas(320, 20)
  bot.chatCanvas = canvas

  const _renderCtx = canvas.getContext('2d')
  canvas.render = function render (options = {}) {
    const { data } = _renderCtx.getImageData(0, 0, canvas.width, canvas.height)
    const components = convertImageData(data, canvas.width, options)

    components.forEach(c => bot.tellrawJSON(c))
  }

  canvas.renderOnTick = false
  setInterval(() => {
    if (!canvas.renderOnTick || bot.state !== states.PLAY) return
    canvas.render()
  }, 50)
  bot.on('chat_motd', (motd, { position }) => {
    if (!canvas.renderOnTick || position !== 0) return
    bot.core.run('minecraft:title @a actionbar ' + JSON.stringify(motd))
  })
}
module.exports = { bot }