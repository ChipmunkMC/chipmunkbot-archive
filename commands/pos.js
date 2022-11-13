const name = 'pos'
const description = 'Gets the position of a player'
const usages = ['<selector>']
const aliases = ['pos']
const enabled = false

const permLevel = 0

function execute (bot, cmd, player, args) {
  bot.getEntityPos(args.join(' '), (position) => {
    const { x, y, z } = position
    bot.core.run(`minecraft:tellraw @a ${JSON.stringify([
      { text: 'Position: ', color: bot.colors.primary },
      {
        text: `[${x}, ${y}, ${z}]`,
color: bot.colors.secondary,
        clickEvent: { action: 'run_command', value: `/essentials:tp ${x} ${y} ${z}` },
        hoverEvent: { action: 'show_text', value: 'Click to teleport' }
      }
    ])}`)
    // bot.chatQueue.push(`&aPosition: &2${x} ${y} ${z}`)
  })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
