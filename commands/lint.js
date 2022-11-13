const name = 'lint'
const description = 'Lints code using standard'
const usages = ['<code...>']
const aliases = ['lint']
const enabled = true

const permLevel = 0

const standard = require('standard')

async function execute (bot, cmd, entity, args) {
  let fix = false
  if (args[0] === 'fix') {
    fix = true
    args.shift()
  }
  const result = standard.lintTextSync(
    args.join(' ').replace(/\xa7.?/g, '') + '\n',
    { fix }
  ).results[0]
  let resultText = ''
  result.messages.forEach(message => {
    resultText += message.line + ':' + message.column + ': ' + message.message + '\n'
  })
  if (result.output != null) resultText += 'Output: ' + result.output
  bot.tellraw(resultText)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
