function bot (bot) {
  bot.playerFilter = null
  bot.on('player_added', ({ name, UUID }) => {
    if (bot.playerFilter != null && bot.playerFilter.test(name)) bot.kick(UUID)
  })
}

module.exports = { bot }
