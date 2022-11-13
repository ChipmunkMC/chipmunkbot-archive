const axios = require('axios')

async function dineval (code, options = {}) {
  options.server ??= 'http://eval.dinhero21.repl.co'
  options.colors ??= 'none'

  const { data } = await axios.get(options.server, {
    headers: {
      data: code,
      colors: options.colors
    }
  })
  return data
}

module.exports = dineval
