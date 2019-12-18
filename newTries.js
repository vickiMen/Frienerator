const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs');
const path = require("path")
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
    retrieveOutputLink(i.ID) //uncomment when testing
    
})

let videosThatAreCut = []



//reading through the directory "videoLinks" and through each file, setting the item's script to the output that we got from the youtube-dl function.
fs.readdirSync(downloadFolder).forEach((file, index) =>{
    let script = (fs.readFileSync(`${downloadFolder}/${file}`,'utf8'))
    let scriptNoWhiteSpace = script.replace(/\\n$/g, "") //uncomment when testing
    // console.log(script)
    IdToCut[index].script = scriptNoWhiteSpace.trim() //uncomment when testing
    // console.log(IdToCut)
    
})

//function that cuts the videos in the correct timing
const cutVideos = function(video){
    let command = `ffmpeg -ss ${video.start} -i "${video.script}" -t ${video.duration} Video${videoCounter}.mp4;`
    videosThatAreCut.push(command)
    execSync(command, {stdio: 'inherit', cwd: downloadFolder})
}

//calling the funtion that cuts the videos
IdToCut.forEach(video => {
    cutVideos(video) //uncomment when testing
    videoCounter++
})

//reads through the VideoLinks folder, where the cut videos are
let files = fs.readdirSync(downloadFolder)

let filesToConcat = [] //an array that gives me just the name of the file, without extension
let filesWithTSExtension = [] //an array that gives me a name with a .ts extenstion - i.e video1.ts


//filters just the mp4 videos and pushes their name only into the filesToConcat array
for (let i of files){
    if (path.extname(i) == ".mp4"){
        filesToConcat.push(path.basename(`./videoLinks/${i}`, ".mp4"))
    } 
}

// console.log(filesToConcat)

//an array that gives me the command to intermediate each video
let filesToIntermediate = []

//writes the correct command for each video
filesToConcat.forEach(i => {
    let command = `ffmpeg -i ${i}.mp4 -c copy -bsf:v h264_mp4toannexb -f mpegts ${i}.ts;`
    filesToIntermediate.push(command)
    filesWithTSExtension.push(`${i}.ts`)
    execSync(command, {stdio: 'inherit', cwd: downloadFolder})
})

// console.log(filesToIntermediate)
// console.log(filesWithTSExtension)

//concating array, with intermediate file names that has | if it's not the last item, and doesnt get it if it is the last item
let concatThis = []
const concatingStatement = function(array1, array2){
    for (let i=0; i<array1.length; i++){
        if (array1[i] != array1[array1.length-1]){
        concatThis.push(`${array1[i]}|`)
        } else {
            concatThis.push(`${array1[i]}`)
        }
    } 
    
    // for (let h=0; h<array2.length; h++)
    // let command = `ffmpeg -i "concat:${array2}" -c copy -bsf:a aac_adtstoasc [VIDEO_OUTPUT_NAME].mp4`
    // console.log(command)
}
concatingStatement(filesWithTSExtension, concatThis)
// console.log(concatThis)

let lastConcat = concatThis.join("")
let lastConcatCommand = `ffmpeg -i "concat:${lastConcat}" -c copy -bsf:a aac_adtstoasc Final${videoCounter}.mp4`
// console.log(lastConcatCommand)

// const concateAll = function(){
    let finalFullConcatCommand = filesToIntermediate.join("") + lastConcatCommand
// }
console.log(finalFullConcatCommand)


// execSync(command, {stdio: 'inherit', cwd: downloadFolder})
// ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c copy -bsf:a aac_adtstoasc [VIDEO_OUTPUT_NAME].mp4



// console.log(IdToCut) // gives an array of all the videos id to cut
// console.log(videosThatAreCut) // gives an array of all the direct commands to cut each video





const port = 8001
app.listen(port, function () {
    console.log("running on port " + port)
})



module.exports = router