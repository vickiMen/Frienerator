const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require(`path`)
const mongoose = require('mongoose')
const os = require('os')
const fs = require('fs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
// app.use( '/', api )

const PORT = 8080
app.listen(process.env.PORT || PORT)


const scriptsFolder = './scripts3/Friends_Analysis/transcripts_friends/season_all'

fs.readdirSync(scriptsFolder).forEach(file => {

    let episodeNum = ''
    let seasonNum = ''
    const fileName = file.replace(/\.csv/, '')

    if (fileName.length > 3) {
        seasonNum = '10'
        episodeNum = fileName.slice(2)
    }
    else {
        seasonNum = fileName[0]
        episodeNum = fileName.slice(1)
    }

    const e = (fs.readFileSync(`${scriptsFolder}/${file}`,'utf8'))

    let episodeName = e.match(/(The One .*)|(The Last One)/) //episode name
    let e1 = e.replace(/\(.*\)/gm, '') //director's comments
    let e2 = e1.replace(/(([A-Z][a-z]+\.)\s([A-Z][a-z]+\:))/gm, '') //character name with 2words
    let e3 = e2.replace(/([A-Z][a-z]+)\:/gm, '') //character name
    let e4 = e3.replace(/\[.*\]/gm, '') //scene desc.
    let e5 = e4.replace(/(Written by\: .+)/gm, '') //written by
    let e6 = e5.replace(/(Transcribed by\: .+)/gm, '') //transcribed by
    let e7 = e6.replace(/((Ending|Closing) Credits)/gm, '')  //ending credits
    let e8 = e7.replace(/(End)/gm, '')  //ending credits
    let e9 = e8.replace(/Commercial Break/gm, '')  // commercial break
    let e10 = e9.replace(/Opening Credits/gm, '') //opening credits
    let e11 = e10.replace(/\n/gm, '') //new line
    let e12 = e11.replace(/\r/gm, '') //carriage-return
    
    const content = {
        season: seasonNum,
        episode: episodeNum,
        name: episodeName,
        script: e12
    }
    
    fs.writeFileSync(`./scripts3/scriptsOutput/${file}`, JSON.stringify(content))

})

mongoose.connect('mongodb://localhost/Friends', {useNewUrlParser: true})

// const episodeFriends = require('./episodes')

// const blabla = new episodeFriends({
//     season: '5',
//     episode: '15',
//     name: 'TOW blabla',
//     script: 'nlsdfkslfjlksdjflsdkjflsdkjflskdfjlksdjf'
// })

// blabla.save()