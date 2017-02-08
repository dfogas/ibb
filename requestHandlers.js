const fs = require("fs")
const url = require("url")
const redis = require("redis")
const client = redis.createClient()
const checkCountParam = require("./lib/checkcountparam")

client.on("error", (err) =>
    fs.appendFile("ibb-error.log", `${err}\n`, "utf8", (error) =>
        console.log(`Error writing to database error log ${error}`)))

function track(req, res) {
    fs.appendFile("requests.json", `${url.parse(req.url).query}\n`, "utf8", (err) => {
        if (err) console.log(`error appending requests log ${err}`)
    })
    if (req.method === "POST" && checkCountParam(req.url)) {
        client.incrby("count", parseInt(url.parse(req.url, true).query.count), (err) => {
            res.writeHead(503, {"Content-Type": "text/html"})
            res.write(`<h3>Failed database driver method call</h3>`)
            res.end()
        })
    } else {
        res.writeHead(405, {"Content-Type": "text/html", "Allow": "POST"})
        res.write(`<h3>Method or method and qs param combination not allowed.</h3>`)
        res.end()
    }
}

function count(req, res) {
    if (req.method === "GET") {
        client.exists("count", (err, reply) => {
            if (err) {
                res.writeHead(503, {"Content-Type": "text/html"})
                res.write(`<h3>Failed database driver method call</h3>`)
                res.end()
            } else if (reply === 1) {
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
