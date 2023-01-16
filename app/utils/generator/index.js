function url(config, opt = {}) {
  const param = opt ? opt.param : undefined
  const query = opt ? opt.query : undefined
  let URL = config.protocol + '://' + config.ip + ':' + config.port + config.path
  if (query) {
    const str = []
    for (const porp in query) {
      if (Object.prototype.hasOwnProperty.call(query, porp)) {
        if (query[porp] !== undefined) {
          str.push(porp + '=' + encodeURIComponent(query[porp]))
        }
      }
    }
    URL += '?' + str.join('&')
  }
  if (param) {
    const params = Object.entries(param)
    for (const prm of params) {
      URL = URL.replace(':' + prm[0], prm[1])
    }
  }
  return URL
}

module.exports = {
  url
}