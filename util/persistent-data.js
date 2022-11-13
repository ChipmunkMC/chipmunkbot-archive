const fs = require('fs/promises')
const path = require('path')
const nbt = require('prismarine-nbt')

async function load (filepath) {
  let parsed
  let type

  try {
    { parsed, type } = await nbt.parse(await fs.readFile(filepath))
  } catch (err) {
    parsed = nbt.comp({})
    type = 'big'
  }

  async function save () {
    await fs.writeFile(filepath, nbt.writeUncompressed(parsed, type))
  }
  setInterval(save, 5 * 60 * 1000)

  return parsed
}

module.exports = load('data.nbt')
