function bot (bot) {
  bot.on('login', () => {
    bot.chat.queue.push('/commandspy:commandspy on')
    // bot.chat.queue.push('/essentials:vanish enable')
    bot.chat.queue.push('/essentials:god enable')
  })

  bot.on('cspy', (player, command, args) => {
    switch (command) {
      case 'icu':
      case 'icontrolu:icu':
        if (args[0] === 'control' && (bot._client.username.startsWith(args[1]) || args[1] === bot._client.uuid)) { bot.core.run(`essentials:sudo ${player.UUID} icontrolu:icu stop`) }
    }
  })
}
function client (bot, client) {
  bot._client.on('game_state_change', (packet) => {
    switch (packet.reason) {
      case 3:
        if (packet.gameMode !== 1) { bot.chat.queue.push('/minecraft:gamemode creative @s[type=player]') }
        break
      case 4:
        bot._client.write('client_command', { payload: 0 })
    }
  })

  bot._client.on('update_health', (packet) => {
    if (packet.health <= 0) { bot._client.write('client_command', { payload: 0 }) }
  })

  bot._client.on('declare_commands', () => bot.chat.queue.push('/op @s[type=player]'))
}

module.exports = { bot, client }
