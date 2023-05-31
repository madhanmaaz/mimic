const express = require("express")
const cookieParser = require("cookie-parser")
const { LocalStorage } = require("node-localstorage")
const app = express()
const fileUpload = require("express-fileupload")
const server = require("http").createServer(app)
const io = require("socket.io")(server)


app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.use(fileUpload())
app.set("view engine", "ejs")
app.use(function (req, res, next) {
    req.io = io
    req.mainPath = __dirname
    next()
})


app.use("/", require("./route/index"))
app.use("/mimic", require("./route/mimic"))
app.use(tokenCheck)
app.use("/panel", require("./route/panel"))


function tokenCheck(req, res, next) {
    const token = req.cookies.token
    if (token && token == "mcauysgureyguyasdnuyg") {
        next()
    } else {
        res.redirect("/")
    }
}


const PORT = process.env.PORT || 3000
server.listen(PORT)