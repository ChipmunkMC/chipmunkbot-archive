const fs = require('fs')
const path = require('path')
const { Midi } = require('@tonejs/midi')
const { convertMidi } = require('../util/midi_converter')
const convertNBS = require('../util/nbs-converter.js')
const parseTXTSong = require('../util/txt-song-parser')

const { instruments } = require('minecraft-data')('1.15.2') // fard

const soundMap = {
  harp: 'block.note_block.harp',
  basedrum: 'block.note_block.basedrum',
  snare: 'block.note_block.snare',
  hat: 'block.note_block.hat',
  bass: 'block.note_block.bass',
  flute: 'block.note_block.flute',
  bell: 'block.note_block.bell',
  guiter: 'block.note_block.guiter',
  chime: 'block.note_block.chime',
  xylophone: 'block.note_block.xylophone',
  iron_xylophone: 'block.note_block.iron_xylophone',
  cow_bell: 'block.note_block.cow_bell',
  didgeridoo: 'block.note_block.didgeridoo',
  bit: 'block.note_block.bit',
  banjo: 'block.note_block.banjo',
  pling: 'block.note_block.pling'
}
const oldSoundMap = {
  harp: 'block.note_block.harp',
  basedrum: 'block.note_block.basedrum',
  snare: 'block.note_block.snare',
  hat: 'block.note_block.hat',
  bass: 'block.note_block.bass',
  flute: 'block.note_block.harp',
  bell: 'block.note_block.harp', // 'entity.experience_orb.pickup'
  guiter: 'block.note_block.bass',
  chime: 'block.note_block.harp',
  xylophone: 'block.note_block.harp',
  iron_xylophone: 'block.note_block.harp',
  cow_bell: 'block.note_block.cow_bell',
  didgeridoo: 'block.note_block.bass',
  bit: 'block.note_block.harp',
  banjo: 'block.note_block.bass',
  pling: 'block.note_block.pling'
}

function inject (bot) {
  bot.music = {
    playing: false,
    queue: [],
    nowPlaying: undefined,
    looping: false,
    _interval: null,
    _playNextSong,
    skip,
    stop,
    play,
    normalize
  }

  bot.music.nowPlaying = {
    name: '',
    tick: {
      current: null,
      total: null
      // npt: null
    }
  }

  setInterval(() => {
    if (!bot.music.playing) return
    const msg = [
      { text: 'Now Playing', color: bot.colors.primary },
      { text: ' | ', color: 'dark_gray' },
      { text: bot.music.nowPlaying.displayName, color: bot.colors.secondary, bold: true },
      { text: ' | ', color: 'dark_gray' },
      format(bot.music.nowPlaying.time),
      { text: ' / ', color: 'gray' },
      format(bot.music.nowPlaying.length)
      // { text: ' (', color: 'dark_gray' },
      // bot.music.nowPlaying.note.npt + ' npt',
      // { text: ')', color: 'dark_gray' }
    ]
    if (bot.music.looping) {
      msg.push({ text: ' | ', color: 'dark_gray' })
      msg.push({ text: 'Looping', color: bot.colors.secondary })
    }
    bot.core.run('/title @a actionbar ' + JSON.stringify(msg))
  }, 500)

  function _playNextSong () {
    const song = bot.music.queue.shift()
    if (song != null) play(song)
  }

  function skip () {
    clearInterval(bot.music._interval)
    bot.music.playing = false
    if (bot.music.queue.length !== 0) _playNextSong()
  }

  function stop () {
    bot.music.queue = []
    clearInterval(bot.music._interval)
    bot.music.playing = false
  }

  function play (filepath) {
    // set stuff up
    filepath = path.resolve(filepath)
    let song
    try {
      switch (path.extname(filepath)) {
        case '.nbs':
          song = convertNBS(fs.readFileSync(filepath))
          break
        case '.js':
        case '.cjs':
        case '.json':
          const requirePath = require.resolve(filepath)
          delete require.cache[requirePath]
          song = normalize(require(requirePath))
          break
        case '.txt':
          song = parseTXTSong(fs.readFileSync(filepath).toString())
          break
        default:
          const midi = new Midi(fs.readFileSync(filepath))
          song = normalize(convertMidi(midi))
      }
      song.displayName = song.name.length > 0 ? `${song.name} (${path.basename(filepath)})` : path.basename(filepath)
      song.time = 0
      bot.music.nowPlaying = song
    } catch (err) {
      bot.core.run('minecraft:tellraw @a ' + JSON.stringify({ text: err?.message, color: bot.colors.error }))
      return
    }

    // play the music lol
    bot.core.run(`/tellraw @a ${JSON.stringify([
      { text: 'Now playing ', color: bot.colors.primary },
      { text: song.displayName, color: bot.colors.secondary },
    ])}`)
    bot.music.playing = true
    bot.music.looping = song.loop
    let startTime = Date.now()
    bot.music._interval = setInterval(() => {
      const intervalTime = song.time + 1
      song.time = Date.now() - startTime

      song.notes.forEach((note, i) => {
        const _time = note.time // Math.floor(note.time)
        if (intervalTime <= _time && song.time >= _time) {
          const sound = soundMap[note.instrument]
          // const oldSound = oldSoundMap[note.instrument]
          const floatingpitch = Math.pow(2, (note.pitch - 12) / 12.0)
          bot.core.run(`minecraft:execute as @a[tag=!nomusic] at @s run playsound ${sound} record @s ^ ^ ^ ${note.volume} ${floatingpitch}`)
        }
      })

      if (song.time > song.length) {
        if (bot.music.looping) {
          startTime = Date.now() + song.loopPosition
          return
        }

        clearInterval(bot.music._interval)
        bot.music.playing = false

        bot.core.run('/tellraw @a ' + JSON.stringify([
          { text: 'Finished playing ', color: 'green' },
          { text: bot.music.nowPlaying.name, color: 'dark_green' }
        ]))
        if (bot.music.queue.length !== 0) _playNextSong()
      }
    }, 1)
  }
}

function normalize (song) {
  const normalizeNote = note => { // change notes with tick to notes with time
    if (note.time == null && note.tick != null) {
      note.time = note.tick * 50
      delete note.tick
    }

    const num = Number(note.instrument)
    if (!Number.isNaN(num)) note.instrument = instruments[num].name
  }
  if (Array.isArray(song)) { // if the song is actually an array, convert it to a song
    let length = 0
    for (const note of song) {
      normalizeNote(note)
      length = Math.max(note.time, length)
    }
    return { name: '', notes: song, loop: false, loopPosition: 0, length }
  }
  let length = 0
  for (const note of song.notes ?? []) {
    normalizeNote(note)
    length = Math.max(note.time, length)
  }
  song.length = length
  return { name: '', notes: [], loop: false, loopPosition: 0, length, ...song }
}
function format (ms) {
  const s = ms / 1000

  const seconds = Math.floor(s / 60).toString()
  const minutes = Math.floor(s % 60).toString()
  return seconds + ':' + (minutes.length <= 1 ? '0' : '') + minutes
}

module.exports.bot = inject
