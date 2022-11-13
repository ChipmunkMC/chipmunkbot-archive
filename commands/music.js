const name = 'music'
const description = 'Plays music'
const usages = [
  'play <song>',
  'list',
  'skip',
  'stop'
  // 'goto <m>:<ss>'
]
const aliases = ['music']
const enabled = true

const permLevel = 0

const fs = require('fs/promises')
const path = require('path')

async function execute (bot, cmd, player, args) {
  const subCmd = args.shift()

  switch (subCmd) {
    case 'play': {
      let filepath = args.join(' ').replace(/\xa7.?/g, '')
      filepath = path.join('music', filepath)
      // if (!filepath.endsWith('.mid')) { filepath += '.mid' }

      if (!checkPath(filepath)) throw new Error('among us')

      try {
        const stats = await fs.lstat(filepath)
        if (stats.isDirectory()) {
          const files = await fs.readdir(filepath)
          filepath = path.join(filepath, files[Math.floor(Math.random() * files.length)])
        }

        if (!bot.music.playing) {
          bot.music.play(filepath)
        } else {
          bot.music.queue.push(filepath)
        }
      } catch (err) {
        throw new Error('File does not exist')
      }
    } break
    case 'list': {
      const clean = args.join(' ').replace(/\xa7.?/g, '')
      const filepath = path.join('music', clean)
      if (!checkPath(filepath)) throw new Error('among us')

      const files = await fs.readdir(filepath)

      let primary = true
      const msg = [{ text: 'Songs - ', color: bot.colors.secondary }]
      for (const file of files) { // TODO: Make this code better
        const isFile = (await fs.lstat(path.join(filepath, file))).isFile()
        msg.push({
          text: file + ' ',
          color: (!((primary = !primary)) ? bot.colors.primary : bot.colors.secondary),
          clickEvent: { action: 'run_command', value: `${bot.prefix}${cmd} ${isFile ? 'play' : 'list'} ${path.join(clean, file)}` }
          // hoverEvent: { action: 'show_text', value: 'Click to play the song' }
        })
      }
      bot.tellraw(msg)
    } break
    case 'skip':
      bot.music.skip()
      break
    case 'stop':
      throw new Error('trold')
      // bot.music.stop()
      break
    case 'loop':
      bot.music.looping = !bot.music.looping
      break
    // case 'goto': {
    //   const [minutes, seconds] = args.split(':').map(Number)
    //
    // } break
    default:
      throw new SyntaxError('Invalid or missing argument')
  }
}

function checkPath (filepath) { // TODO: Make this code better
  return filepath.startsWith('music')
}

/* function randomFile (dirpath) {
  const paths = fs.readdirSync(dirpath)
    .map(filename => path.join(dirpath, filename))
    .filter(file)
} */

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
