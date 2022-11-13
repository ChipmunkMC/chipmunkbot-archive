const mc = require('minecraft-protocol')
const { states } = mc
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const randomUsername = require('./util/random-username.js')

function createBot (options = {}) {
  // defaults
  options.username ??= 'Bot'
  // options.password = options.password ?? null
  options.prefix ??= '!'
  options.isBukkit ??= false
  options.isKaboom ??= false
  options.isScissors ??= false

  options.plugins ??= {}
  fs.readdirSync(
    'plugins'
  ).forEach(filename => { // populate plugins array
    if (typeof require.extensions[path.extname(filename)] && options.plugins[filename] == null) {
      options.plugins[filename] = require(path.resolve('plugins', filename))
    }
  })
  const plugins = []
  Object.keys(options.plugins).forEach((key) => {
    const plugin = options.plugins[key]
    if (plugin) plugins.push(plugin)
  })

  options.colors ??= {}
  options.colors.primary ??= 'white'
  options.colors.secondary ??= 'green'

  options.autoReconnect ??= false
  options.autoReconnectDelay ??= 1000
  options.randomizeUsername ??= false

  options['online-mode'] ??= {}
  options['online-mode'].enabled ??= false
  options['online-mode'].username ??= null
  options['online-mode'].password ??= null
  options['online-mode'].auth ??= 'mojang'

  const clientOptions = { // TODO: More options
    connect: options.connect,
    host: options.server.host,
    port: options.server.port,
    version: options.version,
    username: options['online-mode'].enabled ? options['online-mode'].username : options.username,
    password: options['online-mode'].enabled ? options['online-mode'].username : null,
    auth: options['online-mode'].enabled ? options['online-mode'].auth : null
  }

  if (options.randomizeUsername) {
    clientOptions.username += randomUsername()
  }

  // actually create the bot
  const bot = new EventEmitter()
  bot.plugins = plugins
  bot.loadPlugin = loadPlugin

  // add some properties to the bot
  bot.server = options.server
  /* bot._client.on('set_protocol', (packet) => {
    bot.host = packet.serverHost
    bot.port = packet.serverPort
  }) */
  bot.prefix = options.prefix
  bot.colors = options.colors
  bot.autoReconnect = options.autoReconnect
  bot.randomizeUsername = options.randomizeUsername
  bot['online-mode'] = options['online-mode']
  // set the client and add listeners
  bot.on('set_client', (client) => {
    client.on('connect', () => bot.emit('connect'))
    client.on('error', (err) => bot.emit('error', err))

    bot.disconnect = reason => bot._client.end(reason)
    bot.end = reason => {
      bot.autoReconnect = false
      bot.disconnect()
    }
    client.on('end', (reason) => {
      bot.loggedIn = false
      bot.emit('disconnect', reason)
      // auto reconnect
      if (bot.autoReconnect) {
        setTimeout(() => {
          if (bot.randomizeUsername && !bot['online-mode'].enabled) clientOptions.username = randomUsername()

          bot._client = mc.createClient(clientOptions)
          bot.emit('set_client', bot._client)
        }, options.autoReconnectDelay)
      } else {
        bot.emit('end', reason)
      }
    })

    // more event listeners
    bot._client.on('state', state => {
      bot.state = state
      bot.emit('state', state)
    })
    bot._client.on('login', data => bot.emit('login', data))

    // plugin injection
    bot.plugins.forEach(plugin => {
      if (typeof plugin.client === 'function') plugin.client(bot, options)
    })
  })
  bot._client = options.client ?? mc.createClient(clientOptions)
  bot.emit('set_client', bot._client)

  bot.on('login', () => {
    bot.username = bot._client.username
    bot.uuid = bot._client.uuid
  })

  bot.plugins.forEach(plugin => {
    if (typeof plugin.bot === 'function') plugin.bot(bot, options)
  })

  function loadPlugin (plugin) {
    try {
      if (typeof plugin.bot === 'function') plugin.bot(bot, options)
      if (typeof plugin.client === 'function') plugin.client(bot, options)
      bot.plugins.push(plugin)
    } catch (err) {
      console.log(`Error loading ${plugin}:`)
      console.log(err)
    }
  }

  return bot
}

module.exports = createBot
