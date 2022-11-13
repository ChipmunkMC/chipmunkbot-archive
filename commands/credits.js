const name = 'credits'
const description = 'Shows bot credits.'
const usages = []
const aliases = ['credits']
const enabled = true

const permLevel = 0

const { dependencies } = require('./../package.json')

function execute (bot, cmd, entity, args, handler) {
  bot.tellraw([
    { text: '', color: 'gray' },
    { text: 'Credits\n', color: bot.colors.primary, bold: true },

    { text: '_ChipMC_', color: 'blue' },
    ' - creating the bot\n',

    { text: 'hhhzzzsss', color: 'aqua', bold: true },
    ' - creating the original midi converter\n',

    { text: 'eva', color: 'light_purple', italic: true },
    ' - creating the original midi converter\n',

    { text: 'ma', color: 'aqua' },
    { text: 'ni', color: 'light_purple' },
    { text: 'a', color: 'white' },
    { text: 'pl', color: 'light_purple' },
    { text: 'ay', color: 'aqua' },
    ' - creating the original image converter',

    { text: 'ayunami2000', color: 'red' },
    ' - creating the image converter\n',

    `\nDependencies: ${Object.entries(dependencies).map([key, value] => key + ' ' + value).join(' ')}`
])
}

module.exports = { name, description, usages, aliases, enabled, execute, permLevel }
