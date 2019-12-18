const fs = require('fs');
const execSync = require('child_process').execSync;

          let words = []
          let times = []
     const timeData = []
    const durations = []

const scriptsFolder = './youtube_transcripts'
let downloadCommand = `youtube-dl --skip-download -o '%(id)s.%(ext)s' --write-auto-sub 'https://www.youtube.com/watch?v=`

const durationCalc = function(startTime, nextStartTime){
    return nextStartTime - startTime
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
            time: {
                start: times[i]
            }
        }
    ))

    const parsedTime = times

    parsedTime.forEach( (t,i) => parsedTime[i] = t.replace(/:/g, '') )
    parsedTime.forEach( (pt,i) => durations.push(durationCalc(parseFloat(pt), parseFloat(parsedTime[i+1]))))

    durations.forEach( (d,i) => timeData[i].time.duration = d )

    console.log(timeData)
    return timeData
    //TODO: write code that saves timeData into the 'episodes' collection, using the videoID property
    //TODO: delete file after done
}


retrieveTimeStamppData(`R09b09hNDmo`)