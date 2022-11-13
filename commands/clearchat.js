const name = 'clearchat'
const description = 'Clears the chat'
const usages = ['[selector]']
const aliases = ['clearchat', 'cc']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  const text = []
  while (text.length < 100) {
    text.push('\n')
  }
  text.push({ text: 'The chat has been cleared', color: 'dark_green' })

  bot.core.run(`/minecraft:tellraw ${args.join(' ') || '@a'} ${JSON.stringify(text)}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
