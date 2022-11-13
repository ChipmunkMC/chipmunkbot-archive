function inject (bot) {
  bot.fancyMsg = function (rank, username, message) {
    bot.tellraw([
      { text: '', color: 'gray' },
      { text: '[', color: 'dark_gray' },
      rank,
      { text: '] ', color: 'dark_gray' },
      { text: username, color: bot.colors.secondary },
      { text: ' › ', color: 'dark_gray' },
      message
    ])
  }
}

module.exports.bot = inject
