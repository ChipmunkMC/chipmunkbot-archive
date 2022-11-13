const { Buffer } = require('buffer')

function convertImageData (data, width, options = {}) {
  // Default options
  options.char ??= '⎮'
  options.optimized ??= true

  const components = ['[{"text":"']

  const _jsonChar = options.char.replace(/[\\"]/g, m => '\\' + m)
  let _lastColor = null

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    let color = ''
    if (r !== 0) color += r.toString(16)
    if (g !== 0) color = color.padStart(2, '0') + g.toString(16).padStart(2, '0')
    if (b !== 0) color = color.padStart(4, '0') + b.toString(16).padStart(2, '0')
    color ||= '0'

    if (_lastColor === color) components[components.length - 1] += _jsonChar
    else components[components.length - 1] += `","color":"#${color}"},{"text":"${_jsonChar}`
    _lastColor = color

    if (((i / 4) % width) === 0) {
      components[components.length - 1] += `","color":"#${color}"}]`
      components.push('[{"text":"')
    }
  }

  return components
}

module.exports = convertImageData
