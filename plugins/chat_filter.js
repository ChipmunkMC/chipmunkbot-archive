const nbt = require('prismarine-nbt')
const filter = require('badwords/regexp')

// filter the chat
function inject (bot) {
  bot.chatFilter = {
    enabled: false,
    _lines: [],
    _filter
  }
  bot.on('chat_motd', (motd) => {
    const filtered = _filter(motd)
    bot.chatFilter._lines = [...bot.chatFilter._lines, ...filtered.split('\n')]
    while (bot.chatFilter._lines.length > 99) {
      bot.chatFilter._lines.shift()
    }

    if (motd !== filtered) {
      bot._client.write('set_creative_slot', {
        slot: 36,
        item: {
          present: true,
          itemId: 1,
          itemCount: 1,
          nbtData: nbt.comp({
            '': nbt.string('\xa7r' + bot.chatFilter._lines.join('\xa7r\n'))
          })
        }
      })
      if (bot.server.isScissors) {
        const storage = Math.random().toString()
        bot.core.run('minecraft:data modify storage ' + storage + ' "" set from entity ' + bot._client.uuid + ' Inventory[0].tag.""')
        bot.tellraw({ nbt: '""', storage }, '@a[tag=chatfilter]')
        bot.core.run('minecraft:data remove storage ' + storage + ' i')
      } else bot.tellraw({ nbt: 'Inventory[0].tag.""', entity: bot._client.uuid }, '@a[tag=chatfilter]')
    }
  })
}

function _filter (message) {
  let filtered = message
  filtered = filtered.replace(filter, mogus)
  return filtered
}

function mogus (match) {
  return new Array(match.length).fill('\u0d9e').join('')
}

module.exports.bot = inject
