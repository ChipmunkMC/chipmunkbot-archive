const styles = {
  special: '\xa73',
  number: '\xa76',
  bigint: '\xa76',
  boolean: '\xa76',
  undefined: '\xa78',
  null: '\xa7l',
  string: '\xa72',
  symbol: '\xa72',
  date: '\xa75',
  // "name": intentionally not styling
  // TODO(BridgeAR): Highlight regular expressions properly.
  regexp: '\xa74',
  module: '\xa7n'
}

function stylizeWithColor (str, styleType) {
  const style = styles[styleType]
  if (style !== undefined) return `${style}${str}\xa7r`
  return str
}

module.exports = { stylizeWithColor, styles }
