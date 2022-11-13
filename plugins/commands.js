const fs = require('fs')
const path = require('path')
const { inspect } = require('util')
const { parseText } = require('../util/text_parser.js')
const { getHash } = require('../util/cval.js')

const sectionRegex = /\xa7.?/g

function inject (bot, options) {
  bot.commands = {
    commands: {},
    add,
    execute,
    info,
    isCommand,
    loadFromDir,
    isValid
  }
  const listener = ({ message }, { sender }) => {
    message = parseText(message).raw // fard
    const player = bot.players[sender]

    if (!message.startsWith(bot.prefix)) return

    const args = message.slice(bot.prefix.length).trim().split(' ')
    const command = args.shift().toLowerCase()

    if (!isCommand(command)) {
      bot.tellraw({ text: `Unknown command: ${bot.prefix}${command}`, color: bot.colors.error })
      return
    }

    if (args[args.length - 1]?.endsWith('\\')) {
      bot.tellraw({ text: 'This will be added... idk when.' })
      return
    }

    const { permLevel } = bot.commands.info(command)
    if (permLevel) {
      if (args.length === 0) {
        bot.tellraw({ text: 'Expected a hash', color: bot.colors.error })
        return
      }
      // TODO: Don't use a bad argument parser
      const commandHashLength = message.charCodeAt(message.length - 2) * 2
      if (commandHashLength >= message.length) {
        bot.tellraw({ text: `Length of the hash (${commandHashLength}) is longer than the message's length (${message.length})`, color: bot.colors.error })
        return
      
}
      const originalCommand = message.substring(0, message.length - commandHashLength - 4)
      let commandHash = ''
      for (let i = message.length - commandHashLength - 2; i < message.length - 3; i += 2) {console.log(i, message[i])
        if (message[i - 1] !== '\xa7') {
          bot.tellraw(`Expected an escape character at ${i - 1}`)
          return
        }
        commandHash += message[i]
      }

      const hash = getHash(originalCommand, player.UUID, options.trustedKey)

      console.log({ message, commandHash, commandHashLength, hash, originalCommand })

      if (commandHash !== hash) {
        bot.tellraw({ text: 'Invalid hash', color: bot.colors.error })
        return
      }

      args.splice(-1, hash.split(' ').length) // TODO: Make this less bad
    }

    bot.commands.execute(bot, command, player, args)
  }

  bot.on('emote', listener)
  bot.on('whisper', listener)
  bot.on('announcement', listener)

  function add (command) {
    if (!isValid(command)) throw new Error('Invalid command', 'invalid_command')
    command.aliases.forEach(alias => (bot.commands.commands[alias.toLowerCase()] = command))
  }
  function loadFromDir (dirpath) {
    fs.readdirSync(dirpath).forEach(filename => {
      const filepath = path.resolve(dirpath, filename)
      if (!filepath.endsWith('js') || !fs.statSync(filepath).isFile()) return // TODO: Use require.extensions
      try {
        bot.commands.add(require(filepath))
      } catch (err) {
        bot.console.error('Error loading command ' + filepath + ': ' + inspect(err))
      }
    })
  }
  function info (command) {
    const info = bot.commands.commands[command] ?? command
    if (isValid(info)) return info
  }
  function isCommand (command) { return bot.commands.info(command) != null }
  async function execute (bot, command, player, args, ...custom) {
    const info = bot.commands.info(command)
    if (info == null) {
      bot.tellraw({ text: 'Unknown command: ' + bot.prefix + command, color: bot.colors.error })
      return
    }
    if (!info.enabled) {
      bot.tellraw({ text: bot.prefix + command + ' is disabled', color: bot.colors.error })
      return
    }


    try {
      return await info.execute(bot, command, player, args, ...custom)
    } catch (err) {
      bot.console.error('Error executing command ' + command + ': ' + inspect(err))
      bot.tellraw({ text: err?.name + ': ' + err?.message, color: bot.colors.error })
    }
  }
}

function isValid (command) {
  return command != null &&
  typeof command.execute === 'function' &&
  typeof command.name === 'string' &&
  typeof command.description === 'string' &&
  Array.isArray(command.usages) &&
  Array.isArray(command.aliases) &&
  typeof command.enabled === 'boolean' &&
  command.aliases.length > 0 &&
  typeof command.permLevel === 'number'
}

module.exports.bot = inject
