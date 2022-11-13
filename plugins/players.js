const actions = {
  // doesnt include 0 and 4 because they are special
  1: 'gamemode',
  2: 'ping',
  3: 'displayName'
}

function inject (bot) {
  bot.players = {}
  function removePlayer (uuid) {
    const player = bot.players[uuid]
    if (!player) return false

    delete bot.players[player.name]
    delete bot.players[uuid]

    bot.emit('player_removed', player)
    return true
  }

  bot._client.on('player_info', ({ action, data }) => {
    if (actions[action] == null) { // Special cases
      data.forEach(async player => {
        if (action === 0) {
          bot.players[player.name] = player
          bot.players[player.UUID] = player

          bot.emit('player_added', player)
         } /* else if (action === 4) {
          const { UUID } = player
          try {
            const [selectorComp] = await bot.resolveComponent({ selector: UUID })
            if (selectorComp.text === '' && !selectorComp.extra) removePlayer(UUID)
          } catch (err) {
            removePlayer(UUID)
          }
        } */
      })
      return
    }

    data.forEach(player2 => {
      const player = bot.players[player2.UUID]
      if (!player) return

      const info = actions[action]
      if (player[info] == null || player2[info] == null) return

      player[info] = player2[info]
      bot.emit('player_updated', info, player)
    })
  })
}

module.exports.client = inject
