const express = require("express")
const app = express()
const { v4: uuid } = require("uuid")
const { LocalStorage } = require("node-localstorage")
const localstorage = new LocalStorage("./ssd")
const server = require("http").createServer(app)
const io = require("socket.io")(server)


app.use(express.static(__dirname + "/public"))
app.use(require("cookie-parser")())
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    let ids = []
    for (let i = 0; i < localstorage.length; i++) {
        ids.push(localstorage.key(i))
    }

    res.render("index", {
        data: ids
    })
})

app.get("/panel", (req, res) => {
    let { id } = req.query
    let getData = localstorage.getItem(id)

    if (getData != null) {
        let getData = JSON.parse(localstorage.getItem(id))
        res.render("panel", {
            id,
            data: getData
        })
    } else {
        res.send("ERR: ID NOT FOUND")
    }
})

app.get("/mimic/:id", (req, res) => {
    let { id } = req.params
    let getData = localstorage.getItem(id)
    let createData = {}
    createData["time"] = new Date()

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

    if (getData != null) {
        let getData = JSON.parse(localstorage.getItem(id))
        getData.push(createData)
        localstorage.setItem(id, JSON.stringify(getData, null, 4))
        io.emit(id, createData)
        res.send(`${id} => 200 OK.`)
    } else {
        res.send("ERR: ID NOT FOUND")
    }
})

app.get("/create", (req, res) => {
    let id = uuid()
    localstorage.setItem(id, "[]")
    res.send(id)
})


app.get("/delete", (req, res) => {
    let { value } = req.query

    if (value == "all") {
        localstorage.clear()
    } else {
        if (localstorage.getItem(value) != null) {
            localstorage.removeItem(value)
        }
    }

    res.send("Updated.")
})

app.get("/clear-all", (req, res) => {
    let { id } = req.query

    if (localstorage.getItem(id) != null) {
        localstorage.setItem(id, "[]")
    }

    res.send("Updated.")
})

const PORT = process.env.PORT || 3000
server.listen(PORT)