const fs = require("fs")
const qs = require("querystring")
const url = require("url")
const redis = require("redis")
const client = redis.createClient()
const checkCountParam = require('./lib/checkcountparam')

client.on("error", (err) =>
    fs.appendFile('ibb-error.log', `${err}\n`, 'utf8', (err) =>
        console.log(`Redis client error ${err}`)))

function track(req, res) {
    fs.appendFile('requests.json', `${url.parse(req.url).query}\n`, 'utf8', (err) => {
        if (err) console.log(`error appending requests log ${err}`)
    })
    if (req.method === 'POST' && checkCountParam(req.url)) {
        client.incr("count")
        res.end()
    } else {
        res.writeHead(405, {"Content-Type": "text/html", "Allow": "POST"})
        res.write(`<h3>405 - Method not allowed.</h3>`)
        res.end()
    }
}

function count(req, res) {
    if (req.method === 'GET') {
        client.exists("count", (err, reply) => {
            if (reply === 1) {
                client.get("count", (err, reply) => {
                    if (err) {
                        res.writeHead(503, {"Content-Type": "text/html"})
                        res.write(`<h3>Failed database driver method call</h3>`)
                        res.end()
                    } else {
                        res.writeHead(200, {"Content-Type": "text/plain"})
                        res.write(reply)
                        res.end()
                    }
                })
            } else {
                res.write("0")
                res.end()
            }
        })
    } else {
        res.writeHead(405, {"Content-Type": "text/html", "Allow": "GET"})
        res.write(`<h3>405 - Method not allowed.</h3>`)
        res.end()
    }
}

module.exports = { track, count }
