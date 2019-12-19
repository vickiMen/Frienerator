const express = require('express')
const router = express.Router()
const request = require('request')
const retrieveTimeStamppData = require('../modules/transcript')
const Episode = require('../models/Episode')
const SearchedWord = require('../models/SearchedWord')
// const fs = require('fs');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const apiKey = 'AIzaSyAcvhgH1AvRAY3aFF6NUUdyD4xRBko0Rm8'
const generateVideo = require('../modules/videoGenerator')
const bodyParser = require('body-parser')


const checkDuplicatedWords = async function(searchedWord){
    const isFound = await SearchedWord.find({word: SearchedWord.word})
    if (isFound) {
        isFound.matchedEpisodes.push(searchedWord.matchedEpisodes[0])
    }
    else {
        const newSearchedWord = new searchedWord(searchedWord)
        await newSearchedWord.save()
    }
}

const getTranscript = (videoIds) => {
    videoIds.forEach( v => {
        const searchedWord = transcript(v)
        checkDuplicatedWords(searchedWord) //save to DB
    })
}

const selectRandomEpisode = function(number){
    const x = Math.floor(Math.random() * number)
}


router.get('/getVideo/:sentence', (req, res) => {
    
    const sentenceToBuild = req.params.sentence;
    const wordsToLookUpArr = sentenceToBuild.split(' '); //desired words from client
   
    console.log('wordsToLookUpArr: ', wordsToLookUpArr)
    
    let videoIds = [] //array of arrays: [[word1], [word2], [...]]  =  all matched videos from youtube to searched word on DB

    // 1. Search for words in the episodes - return an object with relevant season and episode
    const wordsResults = []

    wordsToLookUpArr.forEach(async word => {
        let objects = await Episode.aggregate([
            { $match: { 
                script: new RegExp(`${word}`, 'i')
                }
            },
            { $sample: { 
                size: 1 
               } 
            },
            {
                $project: {_id:0, season:1 ,episode:1}
            }
        ])
        console.log('objects', objects)
        let object = objects[0]
        wordsResults.push(object)
    })
    
    console.log('wordsResults', wordsResults)

    // 2. Go to youtube API to get video IDs
    // Get id of each video the words is at
    // Promise.all(promiseArr)
    // .then(foundEpisodes => {
        wordsResults.forEach( async (item, i) => {
            console.log(item[0])
            const response = await request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=friends%20s${item[0].season}e${item[0].episode}&type=video&key=${apiKey}`)

                    const output = JSON.parse(response.body)
                    videoIds.push(output.items.map( item => {return item.id.videoId} ))
                    // if ( i === foundEpisodes.length - 1 ){
                        console.log('videoIds', videoIds)
                    // }
                })

        
    console.log('asdadsa')
    // 3. Get transcript for each episode (Dor's + Vicki's part)
    const timeData = []

    for ( let i of videoIds){
        console.log("grlkgjerl", i)
        for (let h of i){
            console.log("ggggggg", h)
        }
    }

    // timeData.push(videoIds.map( videoIdInner => videoIdInner.map( videoId => {console.log('videoId:', videoId);retrieveTimeStamppData(videoId)})))
    // console.log('timeData:', timeData)

    // 5. Get video part for each word (Efrat's part)
    // const desiredWords = []
    // wordsToLookUpArr.forEach( async word => {
    //     const desiredWord = await SearchedWord.findOne({
    //         word: word
    //     })
    //     desiredWords.push(desiredWord.matchedEpisodes[selectRandomEpisode(desiredWord.matchedEpisodes.length)])   
    // })
    // console.log(desiredWords)
    // generateVideo(desiredWords)
    
    res.end()
})

router.get('/testTranscript', (req, res) => {
    const videoId = ['4_OvFVR5pNs', '1JVrynCAapg']
    getTranscript(videoId)
    res.end()
})

    // exec(commands, function(error, stdout, stderr){ 
    //     // callback(stdout); 
    //     console.log('stdout: ', stdout)
    // });
    
    // execSync(`${commands}`, {stdio: 'inherit', cwd: scriptsFolder})


module.exports = router