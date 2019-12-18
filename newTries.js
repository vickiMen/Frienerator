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
let videoCounter = 0

//array that saves the Id of the videos to cut, the start time and the duration. later on also the script
const IdToCut = [{ ID: `I8ZIErShjw0`, start: '00:00:40.15', duration: "00:00:05.13", script: null}, { ID: "TjPhzgxe3L0", start: '00:00:50.15', duration: "00:00:07.13", script: null}]


//function that creates a new text file with the output of youtube-dl inside
const retrieveOutputLink = function (id){
    let command = `youtube-dl -g "https://www.youtube.com/watch?v=${id}" -f best > Video${videoCounter}.txt;`
    const output = execSync(command, {stdio: 'inherit', cwd: downloadFolder})
}


//calling the function on each of the items in the array to cut
IdToCut.forEach(i => {
    videoCounter++
    // console.log(videoFileCounter)
    retrieveOutputLink(i.ID)
    
})

let videosThatAreCut = []



//reading through the directory "videoLinks" and through each file, setting the item's script to the output that we got from the youtube-dl function.
fs.readdirSync(downloadFolder).forEach((file, index) =>{
    let script = (fs.readFileSync(`${downloadFolder}/${file}`,'utf8'))
    let scriptNoWhiteSpace = script.replace(/\\n$/g, "")
    // console.log(script)
    IdToCut[index].script = scriptNoWhiteSpace.trim()
    // console.log(IdToCut)
    
})

//function that cuts the videos in the correct timing
const cutVideos = function(video){
    let command = `ffmpeg -ss ${video.start} -i "${video.script}" -t ${video.duration} Video${videoCounter}.mp4;`
    execSync(command, {stdio: 'inherit', cwd: downloadFolder})
}

//calling the funtion that cuts the videos
IdToCut.forEach(video => {
    cutVideos(video)
    videoCounter++
})






const port = 8001
app.listen(port, function () {
    console.log("running on port " + port)
})



module.exports = router