function inject (bot) {
  bot.antiCB ??= false
  setInterval(() => {
    if (!bot.antiCB) return
    let offsets

    offsets = { x: randomInt(-8, 8), /* y: 0, */ z: randomInt(-8, 8) }
    bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${(-3) - offsets.x} 0 ~${(-3) - offsets.z} ~${(3) - offsets.x} 255 ${3 - offsets.z} chain_command_block replace command_block', auto: 1b} destroy`)
    offsets = { x: randomInt(-8, 8), /* y: 0, */ z: randomInt(-8, 8) }
    bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${(-3) - offsets.x} 0 ~${(-3) - offsets.z} ~${(3) - offsets.x} 255 ${3 - offsets.z} chain_command_block replace repeating_command_block', auto: 1b} destroy`)
  }, 50)

  // setInterval(() => {
  // if (!bot.antiCB) return
  // let offsets
//
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 0 ~${-8 - offsets.z} ~${8 - offsets.x} 112 ${8 - offsets.z} chain_command_block replace command_block', auto: 1b} destroy`)
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 113 ~${-8 - offsets.z} ~${8 - offsets.x} 225 ${8 - offsets.z} chain_command_block replace command_block', auto: 1b} destroy`)
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 226 ~${-8 - offsets.z} ~${8 - offsets.x} 255 ${8 - offsets.z} chain_command_block replace command_block', auto: 1b} destroy`)
//
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 0 ~${-8 - offsets.z} ~${8 - offsets.z} 112 ${8 - offsets.z} chain_command_block replace repeating_command_block', auto: 1b} destroy`)
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 113 ~${-8 - offsets.z} ~${8 - offsets.z} 225 ${8 - offsets.z} chain_command_block replace repeating_command_block', auto: 1b} destroy`)
  // offsets = { x: randomInt(-8, 8), /*y: 0,*/ z: randomInt(-8, 8) }
  // bot.core.run(`minecraft:execute at @a run setblock ~${offsets.x} 0 ~${offsets.z} command_block{Command: 'minecraft:fill ~${-8 - offsets.x} 226 ~${-8 - offsets.z} ~${8 - offsets.x} 255 ${8 - offsets.z} chain_command_block replace repeating_command_block', auto: 1b} destroy`)
  // }, 50)
}

function randomInt (min, max) {
  return Math.floor((Math.random() * (max - min) + min) + 1)
}

module.exports = inject
