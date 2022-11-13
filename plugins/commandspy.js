const parseString = require('../util/bukkit_chat_parse.js')

function bot (bot) {
  const players = []

  bot.on('player_added', player => {
    const existing = players.findIndex(e => e.player.UUID === player.UUID)
    if (existing !== -1) players.splice(existing, 1)

    players.push({
      player,
      components: [
        ...parseString(`\xa7b${player.name}\xa7b: /`, true, false),
        ...parseString(`\xa7e${player.name}\xa7e: /`, true, false)
      ]
    })
  })

  bot.on('chat', ({ message, sender }) => {
    if (sender !== '00000000-0000-0000-0000-000000000000' || typeof message !== 'object') return

    for (const { player, components } of players) {
      for (const component of components) {
        /* const command = parseCommandSpy(message, component)
        if (command != null) {
          bot.emit('commandspy', player, command)
          bot.core.run('minecraft:say ' + player.name + ' ran ' + command)
          return
        } */
      }
    }
  })
}

module.exports = { bot }
