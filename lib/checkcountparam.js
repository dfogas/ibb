// str(StringURL) -> Boolean
const url = require('url')

function checkCountParam(str) {
    const qsObj = url.parse(str, true).query // boolean specifies whether qs should be object, true - it should
    return Object.keys(qsObj).filter(s => s === 'count').length !== 0
}

module.exports = checkCountParam
