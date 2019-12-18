const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./server/routes/api')
const mongoose = require('mongoose')
/*NEED UPDATED URL FROM VICKI!*/mongoose.connect('mongodb://localhost/weatherDB', { useNewUrlParser: true})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)

app.listen(port, () => console.log(`Server is running on port ${port}`));