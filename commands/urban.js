const name = 'urban'
const description = 'Shows word definitions from the Urban Dictionary'
const usages = ['<word...>']
const aliases = ['urban']
const enabled = true

const permLevel = 0

const ud = require('urban-dictionary')

function execute (bot, cmd, player, args, handler) {
  // Callback
  ud.define(args.join(' ').replace(/§./, ''), (error, results) => {
    if (error) {
      bot.core.run(`/tellraw @a ${JSON.stringify([
        { text: error.message, color: bot.colors.error }
      ])}`)
      return
    }

    const msg = [{ text: '', color: 'gray' }]
    results.forEach((result) => {
      msg.push({ text: '[', color: 'dark_gray' })
      msg.push({ text: 'Urban', color: 'red' })
      msg.push({ text: '] ', color: 'dark_gray' })
      msg.push({ text: `${result.word} `, bold: true })
      const a = result.definition.replace(/\r\n?/g, '\n').split(/\[|\]/)
      for (let i = 0; i < a.length; i += 2) {
        msg.push({ text: a[i] })
        if (a[i + 1] != null) {
          msg.push(
            { text: a[i + 1], underlined: true, clickEvent: { action: 'run_command', value: `${bot.prefix}${name} ${a[i + 1]}` } }
          )
        }
      }
      msg[msg.length - 1].text += '\n'
    })
    bot.tellraw(msg)
  })
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
