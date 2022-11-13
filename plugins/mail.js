/* const nbt = require('prismarine-nbt')
const dataPromise = require('../util/persistent-data.js')

async function inject (bot) {
  const data = await dataPromise

  bot.mail = mail
  bot.sendMail = (sender, reciever, message) => {
    if (!mail[reciever]) mail[reciever] = []
    mail[reciever].push({ sender: sender, message, host: bot.server.host + ':' + (bot.server.port || 25565) })
  }
}

module.exports.bot = inject
*/