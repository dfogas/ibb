const reqHandlers = require('./requestHandlers')

function route(pathname, req, res) {
    if (typeof reqHandlers[pathname] === "function") {
        reqHandlers[pathname](req, res)
    } else {
        res.writeHead(404, {"Content-Type": "text/html"})
        res.write(`<h1>404 - Not Found</h1>`)
        res.end()
    }
}

module.exports = route
