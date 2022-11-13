const name = 'color'
const description = 'Changes your color (useless)'
const usages = ['<color>']
const aliases = ['color']
const enabled = true
const permLevel = 0

const colors = {
  black: '§0',
  dark_blue: '§1',
  dark_green: '§2',
  dark_aqua: '§3',
  dark_red: '§4',
  dark_purple: '§5',
  gold: '§6',
  gray: '§7',
  dark_gray: '§8',
  blue: '§9',
  green: '§a',
  aqua: '§b',
  red: '§c',
  light_purple: '§d',
  yellow: '§e',
  white: '§f',
  reset: '§r'
}

function execute (bot, cmd, player, args) {
  const { Team } = bot

  const color = args.join(' ')
  if (!(color in colors)) throw new Error('Invalid color: ' + color)

  new Team(`chipmunk_${player.UUID}`)
    .setColor(color)
    .setSeeFriendlyInvisibles(false)
    .add(player.UUID)

  bot.core.run(`essentials:nick ${player.UUID} ${colors[color]}${player.name}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
