const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.+'
function randomUsername (length = 16) {
  return (new Array(length)).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
}

module.exports = randomUsername
