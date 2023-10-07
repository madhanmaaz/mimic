const express = require("express")
const app = express.Router()
const { JSONStorage } = require("node-localstorage")
const getIp = require("ipware")().get_ip
const ipInfo = require("ip-info-finder");
const books = new JSONStorage("./ssd/books")

app.route("/:id").get((req, res) => {
    let id = req.params.id
    const CD = {}

    if (checkId(id) == false) {
        res.send("ID ERROR")
        return
    }

    CD["url"] = req.originalUrl
    for (let i in req.headers) {
        CD[i] = req.headers[i]
    }
    CD["query"] = req.query
    CD["cookies"] = req.cookies
    CD["ip-details"] = {}
    let ip = getIp(req).clientIp

    ipInfo.getIPInfo(ip).then(data => {
        for (let key in data["CountryInfo"]) {
            CD["ip-details"][key] = data["CountryInfo"][key]
        }
        delete data["CountryInfo"]

        for (let key in data) {
            CD["ip-details"][key] = data[key]
        }

        req.io.emit(id, CD)
        saveLog(id, CD)
        res.json({ id, res: "OK", code: 200 })
    }).catch(err => {
        res.send("local ip")
        console.log("your testing local ip")
    })
})

app.route("/:id/:filename").get((req, res) => {
    let id = req.params.id
    let filename = req.params.filename
    const CD = {}

    if (checkId(id) == false) {
        res.send("ID ERROR")
        return
    }

    CD["url"] = req.originalUrl
    CD["filename"] = filename
    for (let i in req.headers) {
        CD[i] = req.headers[i]
    }
    CD["query"] = req.query
    CD["cookies"] = req.cookies
    CD["ip-details"] = {}
    let ip = getIp(req).clientIp

    ipInfo.getIPInfo(ip).then(data => {
        for (let key in data["CountryInfo"]) {
            CD["ip-details"][key] = data["CountryInfo"][key]
        }
        delete data["CountryInfo"]
        for (let key in data) {
            CD["ip-details"][key] = data[key]
        }

        req.io.emit(id, CD)
        saveLog(id, CD)

        res.sendFile(`${process.cwd()}/ssd/uploads/${id}/${filename}`, (err) => {
            if (err) res.send("FILE NOT FOUND")
        })
    }).catch(err => {
        console.log(err)
        res.send("local ip")
        console.log("your testing local ip")
    })
})

function checkId(id) {
    if (books.getItem(`${id}.json`) == undefined) return false
}

function saveLog(id, data) {
    let page = books.getItem(`${id}.json`)
    page.data.push(data)
    books.setItem(`${id}.json`, page)
}

module.exports = app