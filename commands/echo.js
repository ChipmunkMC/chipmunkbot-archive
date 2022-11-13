const name = 'echo'
const description = 'Echoes text'
const usages = ['<message...>']
const aliases = ['echo']
const enabled = true

const permLevel = 0

function execute (bot, cmd, player, args, handler) {
  const raw = args
    .join(' ')
    .replace(/&([0-9a-fkl-or]|#[0-9a-f]{6})/gi, m => '\xa7' + m.substring(1))
  bot.core.run(`essentials:sudo ${bot._client.uuid} ${raw.startsWith('/') ? raw.substring(1) : 'c:' + raw}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
