const name = 'vnc'
const description = 'fard'
const usages = [
  'connect \xa7m<host> <port> [password]\xa7r',
  'mouse <x> <y> [state]',
  'update',
  'end'
]
const aliases = ['vnc']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  const subCmd = args.shift().toLowerCase()

  if (subCmd === 'connect') {
    bot.vnc.connect({ host: 'localhost', port: 5900 })
  } else if (subCmd === 'clear') {
    bot.vnc.display.clearEntities()
  } else if (subCmd === 'mouse') {
    const [x, y, state = 1] = args.map(Number)
    bot.vnc._client?.pointerEvent(x, y, state)
  } else if (subCmd === 'update') {
    bot.vnc._client?.requestUpdate()
  } else if (subCmd === 'end') {
    bot.vnc._client.end()
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
