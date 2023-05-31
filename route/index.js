const express = require("express")
const app = express.Router()
const { v4: uuid } = require("uuid")
const { LocalStorage } = require("node-localstorage")
const uploads = new LocalStorage("./ssd/uploads")
const book = new LocalStorage("./ssd/book")
const fs = require("fs")

app.route("/").get((req, res) => {
    const token = req.cookies.token
    if (token) {
        if (token == "mcauysgureyguyasdnuyg") {
            let data = []
            for (let i = 0; i < book.length; i++) {
                let para = JSON.parse(book.getItem(`${book.key(i)}`))
                data.push({ target: para.target, id: para.id })
            }

            res.render("index", {
                data
            })
        } else {
            res.clearCookie("token")
            res.redirect("/")
        }
    } else {
        res.render("login")
    }
}).post((req, res) => {
    const { p1, p2 } = req.body

    if (p1 == "madhan" && p2 == "lockhart") {
        res.cookie("token", "mcauysgureyguyasdnuyg", { maxAge: 1000000 * 1000000 })
    }
    res.redirect("/")
})

app.get("/create", (req, res) => {
    try {
        const { name: target } = req.query
        const id = uuid()

        fs.mkdirSync(`./ssd/uploads/${target}/`)
        book.setItem(`${id}.json`, JSON.stringify({
            target,
            id,
            data: []
        }, null, 4))
        res.send("reload")
    } catch {
        res.send("reload")
    }
})

app.get("/delete", (req, res) => {
    const { value: id } = req.query

    if (id == "all") {
        book.clear()
        uploads.clear()
        res.send("reload")
    } else {
        let a = JSON.parse(book.getItem(`${id}.json`))
        book.removeItem(`${id}.json`)
        uploads.removeItem(a.target)
        res.send("reload")
    }
})

module.exports = app