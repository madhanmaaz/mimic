const express = require("express")
const app = express.Router()
const { LocalStorage } = require("node-localstorage")
const uploads = new LocalStorage("./ssd/uploads")
const book = new LocalStorage("./ssd/book")
const getIp = require("ipware")().get_ip
const ipLocate = require("node-iplocate")

app.route("/:id").get((req, res) => {
    let id = req.params.id

    if (checkId(id) == false) {
        res.send("ID ERROR")
        return
    }
    const CD = {}
    CD["url"] = req.originalUrl
    for (let i in req.headers) {
        CD[i] = req.headers[i]
    }
    CD["query"] = req.query
    CD["cookies"] = req.cookies

    let ip = getIp(req).clientIp
    ipLocate(ip, { "api_key": "c2a00e597228655f0ac10fe0d9da1c4f" }).then((results) => {
        CD["ip-details"] = results
        req.io.emit(id, CD)
        saveLog(id, CD)
        res.send(id + " => 200 OK")
    })
})

app.route("/:id/:filename").get((req, res) => {
    
    let id = req.params.id
    if (checkId(id) == false) {
        res.send("ID ERROR")
        return
    }
    
    let page = JSON.parse(book.getItem(`${id}.json`))
    let filename = req.params.filename
    const CD = {}

    CD["url"] = req.originalUrl
    for (let i in req.headers) {
        CD[i] = req.headers[i]
    }
    CD["query"] = req.query
    CD["cookies"] = req.cookies

    let ip = getIp(req).clientIp
    ipLocate(ip, { "api_key": "c2a00e597228655f0ac10fe0d9da1c4f" }).then((results) => {
        CD["ip-details"] = results
        saveLog(id, CD)
        res.sendFile(req.mainPath + `/ssd/uploads/${page.target}/${filename}`, (err) => {
            if (err) res.send("FILE NOT FOUND")
        })
    })
})


function checkId(id) {
    if (book.getItem(`${id}.json`) == undefined) {
        return false
    }
}

function saveLog(id, data) {
    let page = JSON.parse(book.getItem(`${id}.json`))
    page.data.push(data)
    book.setItem(`${id}.json`, JSON.stringify(page, null, 4))
}

module.exports = app