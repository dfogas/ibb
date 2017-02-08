const http = require("http")
const url = require("url")
const route = require("./router")
const config = require("./config")

const port = config.port
const hostname = config.hostname

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname
    route(pathname.slice(1), req, res)
})

server.listen(port, hostname, () => {
    console.log(`Server ${hostname} is running on ${port}.`)
})

module.exports = server
