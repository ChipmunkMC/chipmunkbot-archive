const path = require('path/posix')

const _fs = {}

class SymbolicLink {
  constructor (filepath = '/') {
    this.filepath = filepath
  }
}

function _parse (filepath) {
  const { root, dir, base, ext } = path.parse(filepath)
  if (root === '') return _parse(path.join('/', filepath))

  let _dir = _fs
  for (const key of dir.split(path.sep)) {
    if (_dir[key] == null) throw new Error('no such file or directory, open ' + filepath, 'ENOENT')
    _dir = _dir[key]
  }

  return { dir: _dir, filename: base + ext }
}

function existsSync (filepath) {
  const { dir, filename } = _parse(filepath)
  return dir[filename] == null
}

function statSync (filepath) {
  const stats = new fs.Stats()
}

function readFileSync (filepath, options) {
  const { dir, filename } = _parse(filepath)
  if (dir[filename] == null) throw new Error('ENOENT: no such file or directory, open ' + filepath, 'ENOENT')

  return dir[filename]
}



functi
