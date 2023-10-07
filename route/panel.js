const express = require("express")
const app = express.Router()
const { JSONStorage } = require("node-localstorage")
const fs = require("fs")

const books = new JSONStorage("./ssd/books")

app.route("/").get((req, res) => {
    const { id } = req.query

    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    let page = books.getItem(`${id}.json`)

    res.render("panel", {
        page
    })
})

app.route("/fm").get((req, res) => {
    const { id } = req.query
    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    let page = books.getItem(`${id}.json`)
    const tarPath = `${process.cwd()}/ssd/uploads/${id}/`
    if (fs.existsSync(tarPath)) {
        let files = fs.readdirSync(tarPath)

        res.render("fm", {
            page,
            files
        })
        return
    }

    res.send("ERROR id not found")
})

app.route("/fm/del").get((req, res) => {
    try {
        const { id, value } = req.query
        if (checkId(id) == false) {
            res.send("ERROR ID NOT FOUND")
            return
        }
        fs.unlinkSync(`${process.cwd()}/ssd/uploads/${id}/${value}`)
    } catch (error) { }
    res.send("reload")
})

app.route("/fm/upload").post((req, res) => {
    const { id } = req.query
    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    if (req.files) {
        let f = req.files.file
        f.mv(`${process.cwd()}/ssd/uploads/${id}/${f.name}`, (err) => {
            if (err) {
                console.log(err)
                res.send("e");
            }
            else res.send("")
        })
    }
})

app.route("/db").get((req, res) => {
    const { id } = req.query
    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    let page = books.getItem(`${id}.json`)
    let html = ""

    for (let i = 0; i < page.data.length; i++) {
        html += tableRender(page.data[i], i + 1)
    }

    res.render("db", {
        page,
        html
    })
})

app.route("/db/del").get((req, res) => {
    const { id } = req.query
    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    let data = books.getItem(`${id}.json`)
    data.data = []
    books.setItem(`${id}.json`, data)
    res.send("reload")
})

app.route("/download").get((req, res) => {
    if (checkId(id) == false) {
        res.send("ERROR ID NOT FOUND")
        return
    }

    const { id } = req.query
    res.download(`${process.cwd()}/ssd/books/${id}.json`)
})

function tableRender(data, index) {
    let html = `
    <div class="item">
    <a href="#item-${index}" id="item-${index}">
    <i class="fa-solid fa-terminal"></i> ${index}</a>
    
    <table>`

    for (let key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            let inTable = ` <tr>
                <th>${key}</th>
                <td>
                    <table>
                        `
            for (let ina in data[key]) {
                inTable += `<tr>
                    <th>${ina}</th>
                    <td>${data[key][ina]}</td>
                </tr>`
            }
            inTable += `</table></td></tr>`
            html += inTable
        } else {
            html += `<tr>
                <th>${key}</th>
                <td>${data[key]}</td>
            </tr>`
        }
    }

    html += `</table></div>`
    return html
}

function checkId(id) {
    if (books.getItem(`${id}.json`) == undefined) return false
}

module.exports = app