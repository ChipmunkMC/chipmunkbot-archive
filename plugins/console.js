const fs = require('fs')
const util = require('util')
const moment = require('moment')
const ansimap = {
  0: '\x1b[0m\x1b[30m',
  1: '\x1b[0m\x1b[34m',
  2: '\x1b[0m\x1b[32m',
  3: '\x1b[0m\x1b[36m',
  4: '\x1b[0m\x1b[31m',
  5: '\x1b[0m\x1b[35m',
  6: '\x1b[0m\x1b[33m',
  7: '\x1b[0m\x1b[37m',
  8: '\x1b[0m\x1b[90m',
  9: '\x1b[0m\x1b[94m',
  a: '\x1b[0m\x1b[92m',
  b: '\x1b[0m\x1b[96m',
  c: '\x1b[0m\x1b[91m',
  d: '\x1b[0m\x1b[95m',
  e: '\x1b[0m\x1b[93m',
  f: '\x1b[0m\x1b[97m',
  r: '\x1b[0m',
  l: '\x1b[1m',
  o: '\x1b[3m',
  n: '\x1b[4m',
  m: '\x1b[9m',
  k: '\x1b[6m'
}

function inject (bot) {
  bot.console = {
    filepath: null,
    host: 'all',
    log,
    warn,
    error,
    _log,
    setRl,
    _rl: null
  }
  function log (data) {
    _log('\u00a72INFO', process.stdout, data)
  }
  function warn (data) {
    _log('\u00a7eWARN', process.stderr, data)
  }
  function error (data) {
    _log('\u00a7cERROR', process.stderr, data)
  }
  function _log (prefix, stdout, data) {
    // format it
    data = `[${moment().format('HH:mm:ss')} ${prefix}\u00a7r] ${data}\n`

    // log to file
    const filepath = bot.console.filepath
    if (filepath != null) {
      fs.appendFile(filepath, data, err => {
        if (err) console.error(err)
      })
    }

    // log to stdout
    data = data.replace(/\u00a7.?/g, m => ansimap[m.slice(1)] ?? '') + '\x1b[0m'
    stdout.write(data)
  }

  function setRl (rl) {
    rl?.prompt(true)
    rl?.on('line', handleLine)
    // bot.console._rl?.removeListener('line', handleLine)
    bot.console._rl = rl

    async function handleLine (line) {
      if (bot.server.host !== bot.console.host && bot.console.host !== 'all') return
      if (line.startsWith('.')) {
        const args = line.slice(1).trim().split(' ')
        const command = args.shift()

        if (!bot.commands.isCommand(command)) {
          bot.console.error('Unknown command: ' + command)
          return
        }
        const info = bot.commands.info(command)
        try {
          await info.execute(bot, command, bot.players[bot.uuid], args)
        } catch (err) {
          bot.console.error(`Error executing ${command} in console: ${util.inspect(err)}`)
        }
      } else {
        bot.fancyMsg(bot._client.username + ' Console', '_ChipMC_', line)
        rl?.prompt(true)
      }
    }
  }
}

module.exports.bot = inject
