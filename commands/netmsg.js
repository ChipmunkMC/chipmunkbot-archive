const name = 'netmsg'
const description = 'Sends a message as each bot'
const usages = ['<message...>']
const aliases = ['netmsg']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args) {
  const { host, port = 25565 } = bot.server

  let displayNameArr = player.displayName
  if (!Array.isArray(displayNameArr)) {
    if (typeof displayNameArr === 'object') {
      const arr = [displayNameArr, ...(Array.isArray(displayNameArr.extra) ? displayNameArr.extra : [])]
      delete displayNameArr.extra
      displayNameArr = arr
    } else if (typeof displayNameArr === 'string') {
      displayNameArr = [displayNameArr]
    } else {
      displayNameArr = [player.name]
    }
  }
  displayNameArr[0].color ??= bot.colors.secondary

  const msg = JSON.stringify([
    { text: '', color: 'gray' },
    { text: '[', color: 'dark_gray' },
    { text: host, clickEvent: { action: 'copy_to_clipboard', value: host + ':' + port }, hoverEvent: { action: 'show_text', value: { text: host + ':' + port + '\nClick to copy the ip to your clipboard', color: bot.colors.primary } } },
    { text: '] ', color: 'dark_gray' },
    ...displayNameArr,
    { text: ' › ', color: 'dark_gray' },
    args.join(' ')
  ])

  bot.getBots().forEach((bot) => {
    bot.core.run('minecraft:tellraw @a ' + msg)
  })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
