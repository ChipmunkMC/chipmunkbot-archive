const fs = require('fs')
const path = require('path')

const cperms = require('./cperms2.js')

let commands = {}

function addCommand (command) {
  if (!isValid(command)) throw new Error(`Command ${command} is invalid.`)

  if (commands[command] == null) { commands[command] = command }
  command.aliases.forEach((alias) => {
    alias = alias.toLowerCase()
    if (commands[alias] == null) commands[alias] = command
  })
}

function load () {
  fs.readdirSync(
    path.join(__dirname, 'commands')
  ).forEach((file) => {
    if (file.endsWith('.js')) {
      const command = path.join(__dirname, 'commands', file)
      try {
        const cmd = require(command)
        addCommand(cmd)
      } catch (e) {
        console.log(`Error loading command ${command}:`)
        console.log(require('util').inspect(e))
      }
    }
  })
}

function reload () {
  try {
    Object.keys(commands).forEach(key => {
      const command = commands[key]
      delete require.cache[command.path]
    })
  } catch (err) { }
  commands = {}
  load()
}

function execute (bot, command, player, args, ...custom) {
  const cmd = info(command)
  if (!cmd.enabled) { return bot.core.run(`/bcraw &cThe command ${bot.prefix}${command} is disabled.`) }

  if (cmd.permLevel > 0) {
    if (args.length < 1) {
      bot.core.run('/bcraw &cYou must provide a code to run this command.')
      return
    }

    const code = args.splice(-1, 1)[0].replace(/\u00a7.?/g, '')

    if (!cperms.validate(cmd.permLevel, player.name, code)) {
      bot.core.run(`/tellraw @a ${JSON.stringify([
        { text: `Invalid code: ${code}.`, color: bot.colors.error }
      ])}`)
      return
    }
  }

  try {
    return cmd.execute(bot, command, player, args, module.exports, ...custom)
  } catch (err) {
    console.log(`Error executing command ${command}:`)
    console.log(err)

    bot.core.run(`/tellraw @a ${JSON.stringify({ text: err.message, color: bot.colors.error })}`)
  }
}

function info (command) {
  return commands[command]
}

function isCommand (command) {
  return commands[command] != null
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

module.exports = { addCommand, load, reload, execute, info, isCommand, isValid, commands }
