const name = 'eval'
const description = 'secure!!1'
const usages = ['<code...>']
const aliases = ['eval']
const enabled = true
const permLevel = 0

const { inspect } = require('util')
const dineval = require('../util/dineval.js')
const { stylizeWithColor } = require('../util/stylize_with_color.js')

async function execute (bot, cmd, player, args) {
  const getCode = () => args.join(' ').replace(/\xa7.?/g, '')

  switch (args.shift()) {
    case 'run': {
      let result
      try {
        result = await bot.eval(getCode(), { inspect: true })
      } catch (err) {
        result = err
      }
      bot.tellraw(result)
    } break
    case 'reset': {
      bot.eval._worker.terminate()
    } break
    case 'dineval': {
      const result = await dineval(getCode(), { colors: 'minecraft' })
      const resultStr = typeof result === 'string' ? result : inspect(result, { stylize: stylizeWithColor })

      bot.tellraw(resultStr)
    } break
    default: {
      throw new SyntaxError('Invalid or missing argument')
    }
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
