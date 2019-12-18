//sdout - standard output
//stdin - standart input
//stderr - standard error
// in order to create a new path - >


const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs');
const execFile = require('child_process').execFile;
const exec = require('child_process').exec;
const shell = require("shelljs")
const youtubeDL = require("youtube-dl")

//all the IDs to cut for the request

const IdToCut = [{ ID: "1-7ABIM2qjU", start: '00:00:40.15', duration: "00:00:05.13" }, { ID: "I8ZIErShjw0", start: '00:00:50.15', duration: "00:00:07.13" }]

// const videoDowload = `youtube-dl -g https://www.youtube.com/watch?v=${i} -f best;`
//start + duration --> hh:mm:ss.ms


// gets youtube id - returns cut command with url, start time and duration
const videosBashToCut = IdToCut.map(i => {
    return {
        url: `https://www.youtube.com/watch?v=${i.ID}`,
        command: `youtube-dl -g https://www.youtube.com/watch?v=${i.ID} -f best ;`,
        start: i.start,
        duration: i.duration
    }
})
// console.log(videosBashToCut)



// writing a filestream to the bash
const bash1stCommand = fs.createWriteStream('./friends-bash.sh', { encoding: "utf8" })
// bash1stCommand.write(videosBashToCut[0].command)

videosBashToCut.forEach((originalVideoToCut, index) => {
    bash1stCommand.write(originalVideoToCut.command)
    bash1stCommand.write('\n')
    if (index === videosBashToCut.length - 1) {
        bash1stCommand.end()
    }
})

// console.log(videosBashToCut)
//returns a bash command of cutting instructions
fileCounter = 0

const videosBashToConcat = videosBashToCut.map(output =>
    `ffmpeg -ss ${output.start} -i "${output.url}" -t ${output.duration} F${fileCounter++}.mp4;`
)

// console.log(videosBashToConcat)


// const bash2ndCommand = fs.createWriteStream('./friends-bash.sh', { encoding: "utf8" })

// videosBashToConcat.forEach((bashCommand, index) => {
//     bash2ndCommand.write(bashCommand)
//     bash2ndCommand.write('\n')
//     if(index === videosBashToConcat.length - 1) {
//         bash2ndCommand.end()
//     }
// })




// exec command
execFile("bash", ["friends-bash.sh"], { encoding: "utf8" }, (err, stdout, stderr) => {
    if (err){
        console.error(stderr)
        throw err
    }
    let blabla = stdout
    console.log(blabla)
})



// exec('bash', function (err, stdout, stderr) {
//     if (err) {
//         console.error('stderr', stderr);
//         throw err;
//     }
//     let blab = stdout.replace(/\s/g, "");
//     console.log(blab)
// })

// const child = execFile("bash", ["friends-bash.sh"], async (error, stdout, stderr) => {
//     if (error) {
//         console.error('stderr', stderr);
//         throw error;
//     }
//     console.log(stdout)
//     let blab = await stdout.replace(/\s/g, "");
//     console.log(blab)
    // fs.writeFileSync('./friends-bash.sh', videoCut(start, output, duration))
    // execFile("bash", ["friends-bash.sh"], async (error, stdout, stderr) => {
    //     if (error){
    //         console.error('stderr', stderr);
    //     throw error;
    //     }
    //     let ggg = await stdout
    //     console.log(ggg)
    // })
// })

// execFile("bash", ["friends-bash.sh"], async (error, stdout, stderr) => {
//     try {
//      const bla = await stdout 
//      console.log(bla)
//     } catch (error) {
//         console.error('stderr', stderr);
//         throw error;
//     }
    // if (error) {
    
    // }
    // console.log(stdout)
    // let blab = stdout.replace(/\s/g, "");
    // console.log(blab)
// })

// console.log(child)


const port = 8000
app.listen(port, function () {
    console.log("running on port " + port)
})



module.exports = router