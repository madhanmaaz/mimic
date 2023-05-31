const express = require("express")
const app = express.Router()
const { LocalStorage } = require("node-localstorage")
const uploads = new LocalStorage("./ssd/uploads")
const book = new LocalStorage("./ssd/book")
const fs = require("fs")

app.route("/").get((req, res) => {
    const { id } = req.query
    let page = JSON.parse(book.getItem(`${id}.json`))
    let files = fs.readdirSync(`${req.mainPath}/ssd/uploads/${page.target}/`)

    let fm = ""
    let index = 1
    for (let file of files) {
        fm += `<tr>
            <td>${index}.</td>
            <td>${file}</td>
            <td><button id="fm-copy" data-value="${file}"><i class="so so-copy"></i></button>
            <button id="fm-delete" data-value="${file}"><i class="ma ma-delete"></i></button></td>
        </tr>`
        index += 1
    }

    res.render("panel", {
        page,
        fm
    })
})

app.get("/data", (req, res) => {
    const { id } = req.query
    let page = book.getItem(`${id}.json`)
    res.send(page)
})

app.get("/del", (req, res) => {
    const { id } = req.query
    let page = JSON.parse(book.getItem(`${id}.json`))
    page.data = []
    book.setItem(`${id}.json`, JSON.stringify(page))
    res.send(page)
})

app.get("/fileDel", (req, res) => {
    const { id, value } = req.query
    let page = JSON.parse(book.getItem(`${id}.json`))
    fs.unlinkSync(`${req.mainPath}/ssd/uploads/${page.target}/${value}`)
    res.send("")
})

app.post("/upload", (req, res) => {
    const { id } = req.query
    let page = JSON.parse(book.getItem(`${id}.json`))
    if (req.files) {
        let f = req.files.file
        f.mv(`${req.mainPath}/ssd/uploads/${page.target}/${f.name}`, (err) => {
            if (err) { res.send("e"); }
            else res.send("")
        })
    }
})

app.get("/download", (req, res) => {
    res.download(`${req.mainPath}/ssd/book/${req.query.id}.json`)
})


module.exports = app