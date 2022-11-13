function bot (bot) {
  if (!bot.server.isKaboom) return
  
  bot.skinQueue = []
  setInterval(() => {
    if (!bot.loggedIn) bot.skinQueue.splice(0, bot.skinQueue.length)
    if (bot.skinQueue.length === 0) return
    const { UUID, name } = bot.skinQueue.shift()
    // bot.core.run('minecraft:tellraw @a ' + JSON.stringify([{ text: 'Setting the skin of ', color: bot.colors.primary }, { text: name, color: bot.colors.secondary }]))
    bot.core.run('essentials:sudo ' + UUID + ' extras:skin ' + name)
  }, 2250)

  bot.on('player_added', ({ name, UUID, properties }) => {
    if (UUID === bot._client.uuid || properties.some(({ name }) => name === 'textures')) return
    bot.skinQueue.push({ name, UUID })
  })
}

module.exports = { bot }
