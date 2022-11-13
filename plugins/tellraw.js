const nbt = require('prismarine-nbt')
const snbt = require('mojangson')
const toNBTUUID = require('../util/uuid-to-nbt-uuid.js')

function bot (bot) {
  function _itemTellraw (json, target) {
    bot._client.write('set_creative_slot', {
      slot: 36,
      item: {
        present: true,
        itemId: 1,
        itemCount: 1,
        nbtData: nbt.comp({
          '': nbt.string(json)
        })
      }
    })
    if (bot.server.isScissors) {
      const storage = Math.random().toString()
      bot.core.run('minecraft:data modify storage ' + storage + ' "" set from entity ' + bot._client.uuid + ' Inventory[0].tag.""')
      bot.core.run(`minecraft:tellraw ${target} ${JSON.stringify({ nbt: '""', storage, interpret: true })}`)
      bot.core.run('minecraft:data remove storage ' + storage + ' i')
    } else {
      bot.core.run(`minecraft:tellraw ${target} ${JSON.stringify({ nbt: 'Inventory[0].tag.""', entity: bot._client.uuid, interpret: true })}`)
    }
  }

  function tellrawJSON (json, target = '@a') {
    if (/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(target)) {
      target = `@p[nbt=${snbt.stringify(nbt.comp({ UUID: toNBTUUID(target) }))}]`
    }

    const command = `minecraft:tellraw ${target} ${json}`
    if (command.length > 32767 || command.includes('selector') || (bot.server.isAyunBoom && /@e|@r\[[^\]]*limit=\d+[^\]]*\]/.test(command))) {
      _itemTellraw(json, target)
      return
    }
    bot.core.run(command)
  }

  function tellraw (message, target) { tellrawJSON(JSON.stringify(message), target) }

  function resolveComponent (message, timeout = 30000) {
    return new Promise((resolve, reject) => {
      if (typeof message === 'object' && !Array.isArray(message)) {
        if (message.extra) message = [message, ...message.extra]
        else message = [message]
      } else if (typeof message !== 'object') {
        message = [message].flat()
      }

      const char = String.fromCharCode(Math.floor(Math.random() * (0xFFF + 1)))
      bot.tellraw({ text: char, extra: message }, bot.uuid)

      const listener = ({ message, sender, position }) => {
        if (message?.text !== char || sender !== '00000000-0000-0000-0000-000000000000' || position !== 1) return
        resolve(message.extra)
        bot.removeListener('chat', listener)
      }
      bot.on('chat', listener)
      setInterval(() => {
        reject(new Error(`Timed out after ${timeout}ms`))
        bot.removeListener('chat', listener)
      }, timeout)
    })
  }

  bot.tellrawJSON = tellrawJSON
  bot.tellraw = tellraw
  bot.resolveComponent = resolveComponent
}

module.exports = { bot }
