const http = require("http")
const url = require("url")
const route = require("./router")
const reqHandlers = require("./requestHandlers")

const port = 3007
const hostname = "127.0.0.1"

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname
    route(pathname.slice(1), req, res)
})

server.listen(port, hostname, () => {
    console.log(`Server ${hostname} is running on ${port}.`)
})

module.exports = server
