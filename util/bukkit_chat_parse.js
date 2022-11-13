// totallynotskidded™ from https://hub.spigotmc.org/stash/projects/SPIGOT/repos/craftbukkit/browse/src/main/java/org/bukkit/craftbukkit/util/CraftChatMessage.java
const incrementalPattern = /(?<colorCode>\xa7[0-9a-fk-orx])|(?<url>(?:(?:https?):\/\/)?(?:[-\w_\.]{2,}\.[a-z]{2,4}.*?(?=[\.\?!,;:]?(?:[\xa7 \n]|$))))|(?<newline>\n)/gi
const incrementalPatternKeepNewlines = /(?<colorCode>\xa7[0-9a-fk-orx])|(?<url>(?:(?:https?):\/\/)?(?:[-\w_\.]{2,}\.[a-z]{2,4}.*?(?=[\.\?!,;:]?(?:[\xa7 ]|$))))/gi

const colors = {
  0: 'black',
  1: 'dark_blue',
  2: 'dark_green',
  3: 'dark_aqua',
  4: 'dark_red',
  5: 'dark_purple',
  6: 'gold',
  7: 'gray',
  8: 'dark_gray',
  9: 'blue',
  a: 'green',
  b: 'aqua',
  c: 'red',
  d: 'light_purple',
  e: 'yellow',
  f: 'white',
  r: 'reset'
}

const formatting = {
  l: 'bold',
  o: 'italic',
  n: 'underline',
  m: 'strikethrough',
  k: 'obfuscated'
}

function parseString (message, keepNewlines, plain) {
  const list = []
  let currentChatComponent = { text: '' }
  let modifier = {}
  let currentIndex = 0
  let hex = null

  if (message == null) return currentChatComponent
  list.push(currentChatComponent)

  const pattern = keepNewlines ? incrementalPatternKeepNewlines : incrementalPattern
  let needsAdd = false
  for (const match of message.matchAll(pattern)) {
    if (match.index > currentIndex) {
      needsAdd = false
      appendNewComponent(match.index)
    }

    const group = Object.keys(match.groups).find(key => match.groups[key] !== undefined)
    switch (group) {
      case 'colorCode': {
        const c = match[0].toLowerCase().charAt(1)

        if (c === 'x') hex = '#'
        else if (hex != null) {
          hex += c

          if (hex.length === 7) {
            modifier = { color: hex }
            hex = null
          }
        }
        else if (formatting[c] != null) modifier[formatting[c]] = true
        else modifier = { color: colors[c] }
      }
      break
      case 'url':
        if (plain) appendNewComponent(match.index + match[0].length)
        else {
          let url = match[0]
          if (!(url.startsWith("http://") || url.startsWith("https://"))) url = 'http://' + url
          modifier.clickEvent = { action: 'open_url', value: url }
          appendNewComponent(match.index + match[0].length)
        }
        break
      case 'newline':
        if (needsAdd) appendNewComponent(match.index)
        currentChatComponent = null
    }
    currentIndex = match.index + match[0].length
  }

  if (currentIndex < message.length || needsAdd) appendNewComponent(message.length)

  return list

  function appendNewComponent (index) {
    const addition = { text: message.substring(currentIndex, index), ...modifier }
    currentIndex = index
    if (currentChatComponent == null) {
      currentChatComponent = { text: '' }
      list.push(currentChatComponent)
    }
    currentChatComponent.extra ??= []
    currentChatComponent.extra.push(addition)
  }
}

module.exports = parseString
