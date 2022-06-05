const express = require('express')
const app = express()
app.use(express.json())
app.use(express.text())

let router =require('./routes/todos.routes')
const path = require("path");
app.use('/scripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', router)

app.listen(3000, function () {
    console.log("Port 3000 listen")
})