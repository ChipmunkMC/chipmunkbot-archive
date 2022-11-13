const name = 'linteval'
const description = 'lints and evaluates javascript'
const usages = ['<code...>']
const aliases = ['linteval', 'leval']
const enabled = true
const permLevel = 0

const { inspect } = require('util')
const standard = require('standard')

const colormap = ['white', 'yellow', 'red']
const lintOpts = {
  usePackageJson: false
}

async function execute (bot, cmd, player, args) {
  const code = args.join(' ').replace(/\xa7.?/g, '')

  const { results: [ lintResult ] } = standard.lintTextSync(code + '\n', lintOpts)
  const resultMsg = lintResult.messages.map(
    ({ line, column, message, severity }) => ({ text: `${line}:${column}: ${message}`, color: colormap[severity] })
  )
  bot.tellraw(resultMsg)

  const evalResult = await bot.eval(code)
  bot.tellraw({ text: inspect(evalResult), color: bot.colors.primary })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
