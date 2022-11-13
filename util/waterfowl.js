const NULL_SENDER = '00000000-0000-0000-0000-000000000000'

const formatting = ['color', 'bold', 'italic', 'underlined', 'strikethrough', 'obfuscated']

function hasNoFormatting (message) {
  return formatting.every(key => message[key] === undefined)
}

function waterfowl (_message, position, sender, env = {}) {
  env.EssentialsX ??= false
  env.EssentialsXChat ??= false
  env.Extras ??= false
  env.CommandSpy ??= false

  if (!_message) return null

  /* if (
    env.CommandSpy &&
    position === 1 &&
    _message.text === '' &&
    Array.isArray(_message.extra) &&
    _message.extra.length >= 2 &&
    _message.extra.every(c => !hasNoFormatting(c))
  ) {
    const { extra } = _message

    const commandIndex = extra.findIndex(c => c?.text?.startsWith(': /'))
    if (commandIndex !== -1) {
      const displayName = extra.slice(0, commandIndex)
      const command = extra.slice(commandIndex)
      command[0] = { ...command[0], text: command[0].text.substring(3) }
      return { type: 'cspy', displayName, command }
    }
  } */

  if (
    env.Extras &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.extra) &&
    _message.extra.length >= 3
  ) {
    const { extra } = _message

    const sepIndex = extra.findIndex(c => c.text === ': ' && hasNoFormatting(c))
    if (sepIndex !== -1 && sepIndex !== extra.length) {
      const displayName = extra.slice(0, sepIndex)
      const message = extra.slice(sepIndex + 1)
      return { type: 'message', displayName, message }
    }
  }

  if (
    _message.translate === 'chat.type.text' &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.with) &&
    _message.with.length === 2
  ) { // TODO: Make it more strict
    const { with: [displayName, message] } = _message
    return { type: 'message', displayName, message }
  }

  // Emote
  if (
    sender !== NULL_SENDER &&
    // position === 1 &&
    _message.translate === 'chat.type.emote' &&
    hasNoFormatting(_message) &&
    _message.with.length === 2
  ) {
    const [displayName, message] = _message.with

    return { type: 'emote', displayName, message }
  }

  if (
    sender !== NULL_SENDER &&
    position === 1 &&
    _message.text === '* ' &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.extra) &&
    _message.extra.length === 2 &&
    hasNoFormatting(_message.extra[0]) && // TODO: Maybe make this more strict
    _message.extra[0].extra === undefined &&
    _message.extra[1].text === ' ' &&
    hasNoFormatting(_message.extra[1]) &&
    Array.isArray(_message.extra[1].extra)
  ) {
    const displayName = _message.extra[0]
    const message = _message.extra[1].extra

    return { type: 'emote', displayName, message }
  }

  // Whisper
  if (
    sender !== NULL_SENDER &&
    position === 1 &&
    _message.translate === 'commands.message.display.incoming' &&
    _message.italic === true &&
    _message.color === 'gray' &&
    Array.isArray(_message.with) &&
    _message.with.length === 2 &&
    hasNoFormatting(_message.with[0]) &&
    _message.with[0].extra === undefined &&
    hasNoFormatting(_message.with[1])
  ) {
    const [displayName, message] = _message.with

    return { type: 'whisper', displayName, message }
  }

  if (
    sender !== NULL_SENDER &&
    position === 1 &&
    _message.text === '' &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.extra) &&
    _message.extra.length === 2 &&
    hasNoFormatting(_message.extra[0]) &&
    _message.extra[0].extra === undefined &&
    _message.extra[1].text === ' whispers to you: ' &&
    hasNoFormatting(_message.extra[1]) &&
    Array.isArray(_message.extra[1].extra)
  ) {
    const displayName = _message.extra[0]
    const message = _message.extra[1].extra

    return { type: 'whisper', displayName, message }
  }

  // Announcement
  if (
    sender !== NULL_SENDER &&
    _message.translate === 'chat.type.announcement' &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.with) &&
    _message.with.length === 2 &&
    hasNoFormatting(_message.with[0]) &&
    _message.with[0].extra === undefined &&
    hasNoFormatting(_message.with[1])
  ) {
    const [displayName, message] = _message.with

    return { type: 'announcement', displayName, message }
  }

  if (
    sender !== NULL_SENDER &&
    _message.text === '[' &&
    hasNoFormatting(_message) &&
    Array.isArray(_message.extra) &&
    _message.extra.length === 2 &&
    hasNoFormatting(_message.extra[0]) &&
    _message.extra[0].extra === undefined &&
    _message.extra[1].text === '] ' &&
    hasNoFormatting(_message.extra[1]) &&
    Array.isArray(_message.extra[1].extra)
  ) {
    const displayName = _message.extra[0]
    const message = _message.extra[1].extra

    return { type: 'announcement', displayName, message }
  }

  return null
}

module.exports = { hasNoFormatting, waterfowl }
