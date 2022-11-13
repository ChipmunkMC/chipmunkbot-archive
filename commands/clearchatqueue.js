const name = 'clearchatqueue'
const description = 'Clears the chat queue of the bot'
const usages = []
const aliases = ['clearchatqueue', 'ccq']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  bot.chat.queue.splice(0, bot.chat.queue)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
