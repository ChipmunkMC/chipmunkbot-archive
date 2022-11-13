const rfb = require('rfb2')

function inject (bot) {
  const display = bot.chatCanvas
  const displayCtx = display.getContext('2d')
  const canvas = new display.constructor(640, 480)
  const ctx = canvas.getContext('2d')

  bot.vnc = {
    connect,
    connected: false,
    display,
    _client: null
  }

  function connect (options = {}) {
    const r = rfb.createConnection(options)
    bot.vnc.ended = false
    r.on('connect', () => {
      bot.vnc.connected = true
      canvas.width = r.width
      canvas.height = r.height
      bot.core.run('minecraft:tellraw @a ' + JSON.stringify([
        { text: 'Connected to ', color: bot.colors.primary },
        { text: r.title, color: bot.colors.secondary }
      ]))
    })
    r.on('rect', rect => setImmediate(() => {
      if (rect.encoding === rfb.encodings.raw) {
        const id = ctx.createImageData(rect.width, rect.height)
        for (let i = 0; i < id.data.length; i += 4) {
          id.data[i] = rect.data[i + 2]
          id.data[i + 1] = rect.data[i + 1]
          id.data[i + 2] = rect.data[i]
          id.data[i + 3] = 255
        }
        ctx.putImageData(id, rect.x, rect.y)
        render()
      } else if (rect.encoding === rfb.encodings.copyRect) {
        ctx.drawImage(canvas, rect.src.x, rect.src.y, rect.width, rect.height, rect.x, rect.y)
      // render()
      }
    }))
    r.on('resize', ({ width, height }) => {
      canvas.width = width
      canvas.height = height
    })
    r.on('error', err => bot.tellraw({ text: 'VNC ' + err, color: bot.colors.error }))
    r.on('end', () => (bot.vnc.ended = true))

    bot.vnc._client = r
    function render () {
      displayCtx.drawImage(canvas, 0, 0, display.width, display.height) // draw image
      display.render() // render it in mc
    }
  }
}

module.exports.bot = inject
