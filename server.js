const express = require("express")
const http = require("http")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const config = require("./ssd/config.json")

const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server)


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(fileUpload())
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Cross-Origin-Resource-Policy", "cross-origin")
    req.io = io
    next()
})


app.use("/", require("./route/"))
app.use("/mimic", require("./route/mimic"))
app.use(function tokenCheck(req, res, next) {
    const token = req.cookies.token
    if (token != undefined && token == config.token) {
        next()
    } else {
        res.redirect("/")
    }
})
app.use("/panel", require("./route/panel"))


const PORT = 3410 || process.env.PORT
server.listen(PORT, () => {
    require("./utils/banner")
    console.log(`URL: http://localhost:${PORT}/
USERNAME: admin
PASSWORD: admin
> want to change ./ssd/config.json
    `)
})