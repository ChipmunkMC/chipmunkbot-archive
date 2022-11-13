const name = 'image'
const description = 'Renders an image.'
const usages = [
  'render <name/url>',
  'list'
]
const aliases = ['image']
const enabled = false

const permLevel = 0

const fs = require('fs')
const { loadImage } = require('canvas')

async function execute (bot, cmd, player, args, handler) {
  const subCmd = args.shift()

  switch (subCmd) {
    case 'render': {
      let src = args.join(' ').replace(/§.?/g, '')
      if (/^https?:\/\//.test(src)) {
        bot.core.run(`/minecraft:tellraw @a ${JSON.stringify([
          { text: 'Attempting to convert image at ', color: bot.colors.primary },
          { text: src, color: bot.colors.secondary }
        ])}`)
      } else {
        src = `./images/${src}`

        if (!src.endsWith('.jpg')) { src += '.jpg' }

        if (src.match(/\//g).length > 2) { throw new Error('Invalid image name.') }

        if (!fs.existsSync(src)) { throw new Error('Invalid image name.') }

        bot.core.run(`/minecraft:tellraw @a ${JSON.stringify([
          { text: 'Attempting to convert image ', color: bot.colors.primary },
          { text: args.join(' ').replace(/§.?/g, ''), color: bot.colors.secondary },
          '.'
        ])}`)
      }
      const canvas = new bot.ChatCanvas()
      const ctx = canvas.getContext('2d')

      const img = await loadImage(src)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.render()
    } break
    case 'list': {
      const files = fs.readdirSync('./images')
      files.filter((file) => file.endsWith('.jpg'))

      let primary = false
      const msg = [{ text: 'Images - ', color: 'gray' }]
      files.forEach((file) => {
        msg.push({
          text: `${file} `,
          color: (((primary = !primary)) ? bot.colors.primary : bot.colors.secondary),
          clickEvent: { action: 'run_command', value: `${bot.prefix}${name} render ${file}` },
          hoverEvent: { action: 'show_text', value: 'Click to render the image' }
        })
      })
      bot.tellraw(msg)
    } break
    default: {
      throw new Error('Invalid or missing argument.')
    }
  }
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
