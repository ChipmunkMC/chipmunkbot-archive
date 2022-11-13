const name = 'spawnmob'
const description = 'but better'
const usages = ['<entity> <amount> [nbt]']
const aliases = ['spawnmob']
const enabled = true
const permLevel = 0

const snbt = require('mojangson')
const nbt = require('prismarine-nbt')

function execute (bot, cmd, player, args) {
  const entity = nbt.string(args.shift())
  if (entity === undefined) throw new Error('Expected an entity')
  const amount = parseInt(args.shift()) || 0
  if (Number.isNaN(amount) || amount > 2000) throw new Error('Invalid amount')

  const optionalNbt = args.length === 0 ? undefined : snbt.parse(args.join(' '))
  if (optionalNbt !== undefined && optionalNbt.type !== 'compound') throw new Error('Invalid optional nbt')

  const Passengers = nbt.list(nbt.comp(new Array(amount).fill(optionalNbt ? { id: entity, ...optionalNbt.value } : { id: entity })))

  bot.execute(`at ${player.UUID} run summon area_effect_cloud ~ ~ ~ ${snbt.stringify(nbt.comp({ Passengers }))}`)
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
