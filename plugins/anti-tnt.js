// I had to make this plugin because of skids (ab)using tnt
const { states } = require('minecraft-protocol')

function bot (bot) {
  bot.antiTNT = {
    enabled: false
  }
  
  setInterval(() => {
    if (!bot.antiTNT.enabled || bot.state !== states.PLAY) return // do nothing if antiTNT is disabled or the bot is not logged in

    bot.core.run('minecraft:gamerule mobGriefing false') // disable mobGriefing
    bot.core.run('minecraft:kill @e[type=tnt]') // remove tnt entities
    bot.core.run('minecraft:kill @e[type=tnt_minecart]') // remove tnt minecart entities
    bot.core.run('minecraft:execute as @e[name=WeaponGrenade] run data merge entity @s {CustomName: ""}') // change grenades to normal eggs
  }, 25)
}

module.exports = { bot }