const fs = require('fs');
const execSync = require('child_process').execSync;
const mongoose = require('mongoose')

          let words = [] // all words in transctipts
          let times = [] // all timestamps in transcript, in accordance with words^
    const durations = [] // all durations for words, in accordance with words^
     const timeData = [] // array of objects - all relevant time info for each word

const scriptsFolder = '/Users/vickimenashe/Documents/Elevation/frienerator/server/modules/youtube_transcripts'
let downloadCommand = `youtube-dl --skip-download -o '%(id)s.%(ext)s' --write-auto-sub 'https://www.youtube.com/watch?v=`

const durationCalc = function(startTime, nextStartTime){
    return nextStartTime - startTime
}


const parseToSeconds = function(timeStamp){
    const a = timeStamp.split(':')
    const b = a[2].split('.')
    const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+b[0]) + (+b[1]) / 1000 
    return seconds
}

const parseSecToStr = function(timeFloat) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeFloat).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + '.' + pad(milliseconds, 3)
}

const retrieveTimeStamppData = function(youtubeVideoID){

    downloadCommand += youtubeVideoID + '\''
    execSync(`${downloadCommand}`, {stdio: 'inherit', cwd: scriptsFolder})

    let script = (fs.readFileSync(`${scriptsFolder}/${youtubeVideoID}.en.vtt`,'utf8'))
    script = script.replace(/(\<c\> )/gm, '')
                   .replace(/(\<\/c\>)/gm, '')
                   .replace(/(WEBVTT\nKind: captions\nLanguage: en)/gm, '')
                   .replace(/(-->.*align.*)\n.*/gm, '')
                   .replace(/\s/gm, '')
                   .replace(/([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}/, '')
                   .replace(/([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}(?=[a-zA-Z]+)/gm, '')

    words = script.match(/[a-zA-Z']+/gm)
    times = script.match(/([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}/gm)


    
    words.forEach( (w,i) => timeData.push(
        {
            word: w,
            matchedEpisodes: [
                {
                    videoId: youtubeVideoID,
                    timeStamp: {
                        start: times[i],
                    }
                }
            ],
            isReady: false
        }
    ))

    const parsedTime = times

    parsedTime.forEach( (t,i) => parsedTime[i] = parseToSeconds(t) )
    parsedTime.forEach( (pt,i) => durations.push(durationCalc(pt, parsedTime[i+1])))

    durations.forEach( (d,i) => timeData[i].matchedEpisodes.forEach( me => me.timeStamp.duration = parseSecToStr(d)))

    console.log(timeData, timeData[0].matchedEpisodes )
      
    return timeData
    //TODO: write code that saves timeData into the 'episodes' collection, using the videoID property
    //TODO: delete file after done
}


retrieveTimeStamppData(`R09b09hNDmo`)

module.exports = retrieveTimeStamppData