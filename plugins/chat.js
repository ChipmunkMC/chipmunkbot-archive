const { waterfowl } = require('../util/waterfowl.js')
const { normalize, parseText } = require('../util/text_parser.js')
const commandSet = 'advMode.setCommand.success'
const commandSetStr = 'Command set: '
const { states } = require('minecraft-protocol')

function bot (bot) {
  bot.chat = {
    queue: []
  }
  setInterval(() => {
    if (bot.state !== states.PLAY) return

    const message = bot.chat.queue.shift()
    if (message) bot._client.write('chat', { message: String(message) })
  }, 100)

  bot.on('chat', ({ message, sender, position }) => {
    const waterfowlMessage = waterfowl(message, position, sender, { Extras: bot.server.isKaboom, CommandSpy: bot.server.isKaboom })
    if (waterfowlMessage != null) {
      bot.emit('waterfowl_message', waterfowlMessage, { message, sender, position })
      bot.emit(waterfowlMessage.type, waterfowlMessage, { message, sender, position })
    }

    bot.emit('chat_motd', parseText(message).raw, { message, sender, position })
  })

  bot.on('chat_motd', (message, { sender }) => {
    bot.console.log(`[${bot.server.host}] ${message.replace(/\n+/g, '\n')}`)
  })
}

function client (bot) {
  bot._client.on('chat', ({ message, sender, position }) => {
    message = JSON.parse(message)
    if (isCommandSet(message)) return

    bot.emit(position === 2 ? 'actionbar' : 'chat', { message, sender, position })
  })
}

function isCommandSet (message) {
  message = normalize(message)
  let firstExtra = message?.extra?.length ? message?.extra[0] : {}
  return (message?.translate === commandSet || firstExtra?.translate === commandSet || message?.text === commandSetStr || firstExtra?.text === commandSetStr)
}

module.exports = { bot, client }
