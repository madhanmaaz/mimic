const express = require("express")
const app = express()
const { LocalStorage } = require("node-localstorage")
const localstorage = new LocalStorage("./ssd")
const server = require("http").createServer(app)
const io = require("socket.io")(server)
const getIp = require("ipware")().get_ip
const ipLocate = require("node-iplocate")

app.use(mimic)
app.use(express.static(__dirname + "/public"))
app.use(require("cookie-parser")())
app.set("view engine", "ejs")

function mimic(req, res, next) {
    if (req.url == "/panel" || req.url == "/clear" || req.url == "/favicon.ico" || req.url == "/download") {
        next()
    } else {
        let createData = {}
        createData["time"] = new Date()
        createData["url"] = req.originalUrl

        for (let i in req.headers) {
            createData[i] = req.headers[i]
        }

        createData["query"] = {}
        for (let i in req.query) {
            createData["query"][i] = req.query[i]
        }

        createData["cookies"] = {}
        for (let i in req.cookies) {
            createData["cookies"][i] = req.cookies[i]
        }

        // ip 
        let ip = getIp(req).clientIp
        ipLocate(ip).then((results) => {
            createData["ip-details"] = results
            let getData = JSON.parse(localstorage.getItem("data.json"))
            getData.push(createData)
            localstorage.setItem("data.json", JSON.stringify(getData, null, 4))
            io.emit("a", "")
            if (req.url.includes("/a")) {
                next()
            } else {
                res.send("Response OK => 200")
            }
        })
    }
}

app.get("/panel", (req, res) => {
    let getData = JSON.parse(localstorage.getItem("data.json"))

    res.render("panel", {
        data: getData
    })
})

app.get("/clear", (req, res) => {
    localstorage.setItem("data.json", "[]")
    res.send("OK")
})

app.get("/download", (req, res) => {
    res.sendFile(__dirname + "/ssd/data.json")
})


const PORT = process.env.PORT || 3000
server.listen(PORT)