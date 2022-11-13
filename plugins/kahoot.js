const Kahoot = require('kahoot.js-api')

const questionColors = ['red', 'aqua', 'yellow', 'green']
const questionSymbols = ['▲', '♦', '●', '■']

function inject (bot) {
  const answerError = () => bot.core.run(`minecraft:tellraw @a ${kahootErrMsg('You cannot currently answer.')}`)
  bot.kahoot ??= {}
  bot.kahoot.playing ??= false
  bot.kahoot.answer ??= answerError
  bot.kahoot.client ??= new Kahoot()
  bot.kahoot.leave = () => {
    bot.core.run(`minecraft:tellraw @a ${kahootMsg('Leaving...')}`)
    bot.kahoot.client?.leave()
    bot.kahoot.playing = false
  }
  bot.kahoot.join = function (pin, username = 'Player') {
    if (bot.kahoot.playing) {
      bot.core.run(`minecraft:tellraw @a ${kahootErrMsg('The bot is already playing kahoot.')}`)
      return
    }
    bot.kahoot.playing = true

    bot.kahoot.client = new Kahoot()
    bot.kahoot.client.join(pin, username).catch((err) => {
      bot.kahoot.playing = false
      bot.core.run(`minecraft:tellraw @a ${kahootErrMsg(err.description)}`)
    })
    bot.kahoot.client.on('Joined', () =>
      bot.core.run(`minecraft:tellraw @a ${kahootMsg('Successfully joined the kahoot.')}`)
    )
    bot.kahoot.client.on('QuizStart', () =>
      bot.core.run(`minecraft:tellraw @a ${kahootMsg('The quiz has started.')}`)
    )
    bot.kahoot.client.on('QuestionReady', (question) =>
      bot.core.run(`minecraft:tellraw @a ${kahootMsg(`A ${question.type} question will start in ${question.timeLeft} seconds.`)}`)
    )
    bot.kahoot.client.on('QuestionStart', (question) => {
      bot.kahoot.answer = (answer) => {
        question.answer(answer)
        bot.kahoot.answer = answerError
      }
      bot.core.run(`minecraft:tellraw @a ${kahootMsg(`A ${question.type} question has started (Time Left: ${question.timeLeft / 1000} seconds).`)}`)
      const answersMsg = ['']
      for (let i = 0; i < question.numberOfChoices; i++) {
        answersMsg.push({ text: '[', color: questionColors[i], clickEvent: { action: 'run_command', value: `${bot.prefix}kahoot answer ${i}` }, hoverEvent: { action: 'show_text', value: 'Click to answer' } })
        answersMsg.push({ text: questionSymbols[i], clickEvent: { action: 'run_command', value: `${bot.prefix}kahoot answer ${i}` }, hoverEvent: { action: 'show_text', value: 'Click to answer' } })
        answersMsg.push({ text: '] ', color: questionColors[i], clickEvent: { action: 'run_command', value: `${bot.prefix}kahoot answer ${i}` }, hoverEvent: { action: 'show_text', value: 'Click to answer' } })
      }
      bot.core.run(`minecraft:tellraw @a ${JSON.stringify(answersMsg)}`)
    })
    bot.kahoot.client.on('QuestionEnd', (results) => {
      bot.kahoot.answer = answerError
      bot.core.run(`minecraft:tellraw @a ${kahootMsg(`You answered ${results.isCorrect ? '' : 'in'}correctly! You currently have ${results.points} points.`)}`)
    })
    bot.kahoot.client.on('QuizEnd', (results) =>
      bot.core.run(`minecraft:tellraw @a ${kahootMsg(`The quiz has ended! Your rank is: ${results.rank}.`)}`)
    )
    bot.kahoot.client.on('Disconnect', (reason) => {
      bot.core.run(`minecraft:tellraw @a ${kahootMsg(`Disconnected: ${reason}`)}`)
    })
  }
}

function kahootMsg (message) {
  return JSON.stringify([
    { text: '', color: 'gray' },
    { text: '[', color: 'dark_gray' },
    { text: 'Kahoot', color: 'dark_purple' },
    { text: '] ', color: 'dark_gray' },
    message
  ])
}

function kahootErrMsg (message) {
  return JSON.stringify([
    { text: '', color: 'red' },
    { text: '[', color: 'dark_gray' },
    { text: 'Kahoot', color: 'dark_purple' },
    { text: '] ', color: 'dark_gray' },
    message
  ])
}

module.exports.bot = inject
