const { createHmac } = require('crypto')

function uuidToIntArray (uuid) {
  return uuid.replace(/-/g, '').match(/.{8}/g).map(str => Number.parseInt(str, 16)).map(num => num & 0x80000000 ? num - 0xffffffff - 1 : num)
}

function getHash (message, uuid, key) {
  const hmac = createHmac('sha256', uuid, key)
  const time = Math.floor(new Date().getTime() / 6942)
  const raw = message + '\\' + uuidToIntArray(uuid).join(';') + '\\' + time + '\\' + key
  const hash = hmac.update(raw).digest()
  const strHash = hash.toString('utf-8')

  return strHash
}

function getCommand (message, uuid, key) {
  const strHash = getHash(message.replace(/[\xa7&][0-9a-fkl-or]/g, ''), uuid, key)

  return `${message} ${strHash.split('').map(c => '\xa7' + c).join('')}\xa7${String.fromCharCode(strHash.length)}\xa7`
}

module.exports = { getHash, getCommand }
