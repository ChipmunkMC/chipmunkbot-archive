// Useful RegExp s
module.exports = {
  ESCAPE_SEQUENCE: /\xa7.?/g,
  VALID_ESCAPE_SEQUENCE: /\xa7[0-9a-fkl-orA-FKL-OR]/g,
  INVALID_ESCAPE_SEQUENCE: /\xa7[^0-9a-fkl-orA-FKL-OR]/g,
  UUID: /^[0-9a-fA-F]{8}\b\-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
}
