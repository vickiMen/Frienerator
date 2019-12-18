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

    const episodeData = (fs.readFileSync(`${scriptsFolder}/${file}`,'utf8'))

    let episodeName = episodeData.match(/(The One .*)|(The Last One)/) //episode name
    
    let script = episodeData
             script = script.replace(/\(.*\)/gm, '') // director's comments
                            .replace(/(([A-Z][a-z]+\.)\s([A-Z][a-z]+\:))/gm, '') //char name 2 word 
                            .replace(/([A-Z][a-z]+)\:/gm, '') //character name
                            .replace(/\[.*\]/gm, '') // scene desc.
                            .replace(/(Written by\: .+)/gm, '')
                            .replace(/(Transcribed by\: .+)/gm, '')
                            .replace(/((Ending|Closing) Credits)/gm, '')
                            .replace(/(End)/gm, '')
                            .replace(/Commercial Break/gm, '')
                            .replace(/Opening Credits/gm, '')
                            .replace(/\n/gm, '') //new line
                            .replace(/\r/gm, '') //carriage-return
    
    const content = {
        season: seasonNum,
        episode: episodeNum,
        name: episodeName,
        script: script
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