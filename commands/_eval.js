const name = '_eval'
const description = 'disabled command, ignore'
const usages = ['<code...>']
const aliases = ['_eval']
const enabled = false

const permLevel = 2

const { inspect } = require('util')

function execute (bot, cmd, player, args, handler) {
  const result = eval(args.join(' ').replace(/\xa7.?/g, ''))
  console.log(inspect(result)) // bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: inspect(result), color: bot.colors.primary }))
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
