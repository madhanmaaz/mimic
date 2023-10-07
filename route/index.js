const express = require("express")
const app = express.Router()
const config = require("../ssd/config.json")
const { JSONStorage } = require("node-localstorage")
const fs = require("fs")
const { v4: uuid } = require("uuid")

const books = new JSONStorage("./ssd/books")
const uploads = new JSONStorage("./ssd/uploads")

app.route("/").get((req, res) => {
    const token = req.cookies.token

    if (token) {
        if (token == config.token) {
            let data = []

            for (let i of books._keys) {
                const book = books.getItem(i)
                data.push({
                    target: book.target,
                    id: book.id
                })
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

    if (p1 == config.username && p2 == config.password) {
        res.cookie("token", config.token, { maxAge: 1000000 * 1000000 })
    }

    res.redirect("/")
})

app.get("/create", (req, res) => {
    try {
        let { target } = req.query
        const id = uuid()
        target = atob(target)

        fs.mkdirSync(`./ssd/uploads/${id}/`)
        books.setItem(`${id}.json`, {
            target,
            id,
            data: []
        })
        res.send("reload")
    } catch (error) {
        console.log(error)
        res.send("reload")
    }
})

app.get("/delete", (req, res) => {
    const { value: id } = req.query

    if (id == "all") {
        books.clear()
        uploads.clear()
        res.send("reload")
    } else {
        books.removeItem(`${id}.json`)
        uploads.removeItem(id)
        res.send("reload")
    }
})

module.exports = app