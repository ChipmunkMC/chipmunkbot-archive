const name = 'help'
const description = 'Lists commands or shows info about a command.'
const usages = ['[command]']
const aliases = ['help']
const enabled = true

const permLevel = 0

function execute (bot, cmd, entity, args) {
  if (args.length > 0) {
    if (!bot.commands.isCommand(args[0])) { return bot.core.run(`/tellraw @a ${JSON.stringify({ text: `Unknown command: ${bot.prefix}${args[0]}`, color: bot.colors.error })}`) }

    const command = bot.commands.info(args.shift())

    let msg
    if (command.usages.length !== 1) {
      msg = [
        { text: bot.prefix + command.name, color: bot.colors.primary },
        { text: ' (' + command.aliases.join(', ') + ')', color: 'white' },
        { text: ` - ${command.description}\n`, color: 'gray' }
      ]
      command.usages.forEach((usage, i) => {
        msg.push(bot.prefix + command.name)
        msg.push({
          text: ` ${usage}\n`,
          color: bot.colors.secondary,
          clickEvent: { action: 'suggest_command', value: command.name + ' ' + usage }
          // hoverEvent: { action: 'show_text', value: 'Click to teleport' }
        })
      })
      msg[msg.length - 1].text = msg[msg.length - 1].text.slice(0, -1)
    } else {
      msg = [
        { text: bot.prefix + command.name, color: bot.colors.primary },
        { text: ' (' + command.aliases.join(', ') + ')', color: 'white' },
        {
          text: ` ${command.usages[0]}`,
          color: bot.colors.secondary,
          clickEvent: { action: 'suggest_command', value: command.name + ' ' + command.usages[0] }
        },
        { text: ` - ${command.description}`, color: 'gray' }
      ]
    }
    return bot.core.run(`minecraft:tellraw @a ${JSON.stringify(msg)}`)
  }
  let commands = []
  Object.keys(bot.commands.commands).forEach((command) => {
    if (bot.commands.isCommand(command) && !commands.includes(bot.commands.info(command))) { commands.push(bot.commands.info(command)) }
  })
  commands = commands.filter((command) => command.enabled)

  const publicList = []
  const trustedList = []
  const adminList = []
  const unknownList = []
  commands.forEach((command) => {
    const msg = {
      color: 'dark_aqua',
      text: bot.prefix + command.name + ' ',
      clickEvent: { action: 'run_command', value: bot.prefix + aliases[0] + ' ' + command.name },
      hoverEvent: { action: 'show_text', value: 'Click to see info about the command' }
    }
    if (command.permLevel === 0) {
      msg.color = 'green'
      publicList.push(msg)
    } else if (command.permLevel === 1) {
      msg.color = 'red'
      trustedList.push(msg)
    } else if (command.permLevel === 2) {
      msg.color = 'dark_red'
      adminList.push(msg)
    } else {
      unknownList.push(msg)
    }
  })

  const msg = [{ text: 'Commands - ', color: 'gray' }, ...publicList, ...trustedList, ...adminList, ...unknownList]
  bot.core.run(`/tellraw @a ${JSON.stringify(msg)}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
