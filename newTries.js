const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs');
const execFile = require('child_process').execFile;
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const youtubeDL = require("youtube-dl")
const downloader = require('youtube-dl/lib/downloader')


const downloadFolder = "./videoLinks"
videoCounter = 0

const retrieveOutputLink = function (id){
    let command = `youtube-dl -g "https://www.youtube.com/watch?v=${id}" -f best > Video${videoCounter}.txt;`
    const output = execSync(command, {stdio: 'inherit', cwd: downloadFolder})
    // console.log(output)
}



const IdToCut = [{ ID: `I8ZIErShjw0`, start: '00:00:40.15', duration: "00:00:05.13" }, { ID: "1-7ABIM2qjU", start: '00:00:50.15', duration: "00:00:07.13" }]

const videosBashToCut = IdToCut.map(i => {
    return {
        url: `https://www.youtube.com/watch?v=${i.ID}`,
        command: `youtube-dl -g https://www.youtube.com/watch?v=${i.ID} -f best ;`,
        start: i.start,
        duration: i.duration
    }
})

IdToCut.forEach(i => {
    console.log(i.ID)
    retrieveOutputLink(i.ID)
    videoCounter++
})









const port = 8001
app.listen(port, function () {
    console.log("running on port " + port)
})



module.exports = router