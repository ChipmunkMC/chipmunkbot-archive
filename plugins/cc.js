function inject (bot) {
  bot.on('cspy', (player, command) => {
    if (command.startsWith('/')) { command = command.slice(1) }
    const args = command.split(' ')
    command = args.shift()

    if (command === 'cc' || command === 'clearchat' || command === 'extras:cc' || command === 'extras:clearchat') {
      bot.core.run(`/tellraw @a ${JSON.stringify([
        { text: '', color: 'dark_green' },
        `${player.name} cleared the chat`
      ])}`)
    }
  })
}

module.exports.bot = inject
