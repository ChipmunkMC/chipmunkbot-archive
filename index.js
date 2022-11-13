const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prefix: '> '
})

const createBot = require('./bot.js')
// const commandHandler = require('./commands.js')

const fs = require('fs/promises')
const path = require('path')
const moment = require('moment')

async function exists (filepath) {
  try {
    await fs.access(filepath)
    return true
  } catch {
    return false
  }
}

async function main () {
  let logPath = path.join('logs', moment().format('YYYY-MM-DD'))
  if (await exists(logPath)) {
    const suffixed = logPath + '-'
    let i = 0
    while (await exists(logPath)) {
      logPath = suffixed + (i++)
    }
  }
  await fs.writeFile(logPath, '')

  const absolutePath = path.resolve('config')
  let optionsArray

  try {
    optionsArray = require(absolutePath)
  } catch {
    await fs.copyFile(path.join(__dirname, 'default.js'), 'config.js')
    console.info('No config file was found, so a default one was created.')

    optionsArray = require(absolutePath)
  }

  const bots = []

  optionsArray.forEach((options, index) => {
    const bot = createBot(options)

    bot.getBots = () => bots
    bot.on('error', console.error)
    bot.console.filepath = logPath
    bot.console.setRl(rl)
    bot.commands.loadFromDir('commands')

    bots.push(bot)
  })
}

main()
