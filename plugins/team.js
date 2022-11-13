// Valid values
const visibilityValues = ['never', 'hideForOtherTeams', 'hideForOwnTeam', 'always']
const collisionRuleValues = ['always','never', 'pushOtherTeams', 'pushOwnTeam']

// TODO: Track players
function bot (bot) {
  class Team {
    destroyed = false
    constructor (name, displayName, isExistingTeam = false) {
      this.name = String(name)
      if (!isExistingTeam) bot.core.run(`minecraft:team add ${this.name}`)
    }
    add (target) {
      bot.core.run(`minecraft:execute at ${bot.uuid} as ${target} run team join ${this.name}`) // execute seems safer than team
      return this
    }
    setDisplayName (displayName) {
      bot.core.run(`minecraft:team modify ${this.name} displayName ${JSON.stringify(displayName)}`)
      return this
    }
    setColor (color) {
      // TODO: Check if the color is valid
      bot.core.run(`minecraft:team modify ${this.name} color ${color}`)
      return this
    }
    setFriendlyFire (boolean) {
      bot.core.run(`minecraft:team modify ${this.name} friendlyFire ${Boolean(boolean)}`)
      return this
    }
    setSeeFriendlyInvisibles (boolean) {
      bot.core.run(`minecraft:team modify ${this.name} seeFriendlyInvisibles ${Boolean(boolean)}`)
      return this
    }
    setNametagVisibility (visibility) {
      if (!visibilityValues.includes(visibility)) throw new TypeError('Value must be ' + visibilityValues.join(', '))
      bot.core.run(`minecraft:team modify ${this.name} nametagVisibility ${visibility}`)
      return this
    }
    setDeathMessageVisibility (visibility) {
      if (!visibilityValues.includes(visibility)) throw new TypeError('Value must be ' + visibilityValues.join(', '))
      bot.core.run(`minecraft:team modify ${this.name} deathMessageVisibility ${visibility}`)
      return this
    }
    setCollisionRule (collisionRule) {
      if (!collisionRuleValues.includes(collisionRule)) throw new TypeError('Value must be ' + collisionRuleValues.join(', '))
      bot.core.run(`minecraft:team modify ${this.name} collisionRule ${collisionRule}`)
      return this
    }
    setPrefix (prefix) {
      bot.core.run(`minecraft:team modify ${this.name} prefix ${JSON.stringify(prefix)}`)
      return this
    }
    setSuffix (suffix) {
      bot.core.run(`minecraft:team modify ${this.name} suffix ${JSON.stringify(suffix)}`)
      return this
    }
    destroy () {
      bot.core.run(`minecraft:team remove ${this.name}`)
      this.destroyed = true
    }
  }

  bot.Team = Team
}

module.exports = { bot }
