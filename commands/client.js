const name = 'client'
const description = 'Creates and manages clients using minecraft-protocol.'
const usages = ['create <options (json)>', 'end <i>', 'write <i> <name> <data (json)>', 'list']
const aliases = ['client']
const enabled = true

const permLevel = 0

const mc = require('minecraft-protocol')
const clients = []
const sectionRegex = /\u00a7.?/g
const util = require('util')

function execute (bot, cmd, player, args, handler) {
  const subCmd = args.shift()

  let client, i, name, data
  switch (subCmd) {
    case 'create':
      const options = JSON.parse(args.join(' ').replace(sectionRegex, ''))
      options.host = bot.server.host
      options.port = bot.server.port
      client = mc.createClient(options)
      i = clients.length
      client.on('login', () => bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: client.username + '\u00a7r logged in.', color: bot.colors.primary })))
      client.on('end', () => {
        clients.splice(i, 1)
        bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: client.username + '\u00a7r ended.', color: bot.colors.primary }))
      })
      client.on('error', (err) => bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: util.inspect(err).replace(/\n.*/g, ''), color: bot.colors.error })))
      clients.push(client)
      break
    case 'end':
      i = parseInt(args.join(' '))
      clients[i].end()
      clients.splice(i, 1)
      break
    case 'write':
      i = parseInt(args.shift())
      name = args.shift()
      data = JSON.parse(args.join(' ').replace(sectionRegex, ''))

      clients[i].write(name, data)
      break
    case 'list':
      bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: 'Clients: ' + clients.map(client => client.username).join('\u00a7r, '), color: bot.colors.primary }))
      break
    default:
      throw new Error('Invalid or missing argument')
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
