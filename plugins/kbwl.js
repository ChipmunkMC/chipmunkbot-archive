// const nbt = require('prismarine-nbt')
// const snbt = require('../util/snbt.js')
// const toNBTUUID = require('../util/uuid-to-nbt-uuid.js')

function bot (bot) {
  bot.kbwl = {
    enabled: false,
    players: []
  }

  bot.on('player_added', ({ name, UUID }) => {
    if (!bot.kbwl.enabled || UUID === bot.uuid || bot.kbwl.players.includes(name)) return
    bot.kick(UUID)
  })
}

module.exports = { bot }
