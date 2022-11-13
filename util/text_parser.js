const { language } = require('./latest-minecraft-data')

const colormap = {
  black: '§0',
  dark_blue: '§1',
  dark_green: '§2',
  dark_aqua: '§3',
  dark_red: '§4',
  dark_purple: '§5',
  gold: '§6',
  gray: '§7',
  dark_gray: '§8',
  blue: '§9',
  green: '§a',
  aqua: '§b',
  red: '§c',
  light_purple: '§d',
  yellow: '§e',
  white: '§f',
  reset: '§r'
}

const ansimap = {
  '§0': '\x1b[0m\x1b[30m',
  '§1': '\x1b[0m\x1b[34m',
  '§2': '\x1b[0m\x1b[32m',
  '§3': '\x1b[0m\x1b[36m',
  '§4': '\x1b[0m\x1b[31m',
  '§5': '\x1b[0m\x1b[35m',
  '§6': '\x1b[0m\x1b[33m',
  '§7': '\x1b[0m\x1b[37m',
  '§8': '\x1b[0m\x1b[90m',
  '§9': '\x1b[0m\x1b[94m',
  '§a': '\x1b[0m\x1b[92m',
  '§b': '\x1b[0m\x1b[96m',
  '§c': '\x1b[0m\x1b[91m',
  '§d': '\x1b[0m\x1b[95m',
  '§e': '\x1b[0m\x1b[93m',
  '§f': '\x1b[0m\x1b[97m',
  '§r': '\x1b[0m',
  '§l': '\x1b[1m',
  '§o': '\x1b[3m',
  '§n': '\x1b[4m',
  '§m': '\x1b[9m',
  '§k': '\x1b[6m'
}

function normalize (message) {
  if (message == null) return ''
  else if (typeof message === 'string' || typeof message === 'number' || typeof message === 'boolean') {
    return message = { text: message }
  } else if (Array.isArray(message) && message.length) {
    const extra = message
    message = extra.shift()
    message.extra ??= []
    message.extra = [...message.extra, ...extra]
    return message
  } else return message
}

/**
 * Parses a native minecraft text component in string form.
 * @param {string} comp - A text component string, such as the chat packet's 'message' property.
 * @returns {object} Parsed message in { raw, clean, ansi } form.
 */
function parseText (comp, isJSON = false) {
  if (isJSON) {
    comp = JSON.parse(comp)
  }

  let raw = parseComponent(comp, { color: 'reset' })
  if (raw.startsWith('§r')) {
    raw = raw.substring(2)
  }
  const clean = raw.replace(/§.?/g, '')
  const ansi = raw.replace(/§[a-f0-9rlonmk]/g, (m) => ansimap[m])
  return { raw, clean, ansi }
}

/**
 * Parses a native minecraft text component in object form.
 * @param {object} comp - The component.
 * @param {object} parent - The parent component.
 * @returns {string} The parsed raw string.
 */
function parseComponent (comp, parent) {
  comp = { ...normalize(comp) }

  comp.color ??= parent.color
  comp.bold ??= parent.bold
  comp.italic ??= parent.italic
  comp.underlined ??= parent.underlined
  comp.strikethrough ??= parent.strikethrough
  comp.obfuscated ??= parent.obfuscated

  let raw = ''
  let formatting = ''

  formatting += colormap[comp.color] || ''
  if (comp.bold) formatting += '§l'
  if (comp.italic) formatting += '§o'
  if (comp.underlined) formatting += '§n'
  if (comp.strikethrough) formatting += '§m'
  if (comp.obfuscated) formatting += '§k'
  raw += formatting

  if (comp.text) {
    raw += comp.text
  } else if (comp.translate) { // I checked with the native minecraft code. This is how Minecraft does the matching and group indexing. -hhhzzzsss
      const _with = comp.with ?? []
      let i = 0
      raw += (language[comp.translate] ?? comp.translate).replace(/%(?:(\d+)\$)?(s|%)/g, (g0, g1) => {
      if (g0 === '%%') {
        return '%'
      } else {
        const idx = g1 ? parseInt(g1) : i++
        if (_with[idx] != null) {
          return parseComponent(_with[idx], comp) + formatting
        } else {
          return ''
        }
      }
    })
  } else if (comp.selector) {
    raw += comp.selector
  } else if (comp.keybind) {
    raw += comp.keybind
  } else if (comp.nbt) {
    // raw += ''
  }

  if (comp.extra) {
    comp.extra.forEach((extra) => {
      raw += parseComponent(extra, comp)
    })
  }
  return raw
}

module.exports = { normalize, parseText }
