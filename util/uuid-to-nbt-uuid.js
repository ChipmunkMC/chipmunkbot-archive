// originally from https://gist.github.com/storycraft/7813dd0186e85daa393e1df9cfa19f2a
const nbt = require('prismarine-nbt')

function toNBTUUID (uuid) {
  return nbt.intArray(nbt.int(uuid.replace(/-/g, '').match(/.{8}/g).map(str => Number.parseInt(str, 16)).map(num => num & 0x80000000 ? num - 0xffffffff - 1 : num)))
}

module.exports = toNBTUUID
