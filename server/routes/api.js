const express = require('express')
const router = express.Router()
const request = require('request')
const transcript = require('../modules/transcript')
const Episode = require('../models/Episode')
const SearchedWord = require('../models/SearchedWord')
// const fs = require('fs');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const apiKey = 'AIzaSyAcvhgH1AvRAY3aFF6NUUdyD4xRBko0Rm8'


const checkDuplicatedWords = async function(searchedWord){
    const isFound = await searchedWords.find({word: searchedWord.word})
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
        checkDuplicatedWords(searchedWord)
        new searchedWord(transcript(v))
    })
}


router.get('/getVideo/:sentence', (req, res) => {
    
    const sentenceToBuild = req.params.sentence;
    const wordsToLookUpArr = sentenceToBuild.split(' '); //desired words from client
    let promiseArr = [] //to be resolved found words from DB
    let videoIds = [] //array of arrays: [[word1], [word2], [...]]  =  all matched videos from youtube to searched word on DB

    // 1. Search for words in the episodes - return an object with relevant season and episode
    wordsToLookUpArr.forEach(word => {
        promiseArr.push(Episode.aggregate([
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
        ]))
    })

    // 2. Go to youtube API to get video IDs
    // Get id of each video the words is at
    Promise.all(promiseArr)
    .then(foundEpisodes => {
        foundEpisodes.forEach( (item, i) => {
            router.request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=friends s${item.season}e${item.episode}&type=video&key=${apiKey}`, function(err, response){
                videoIds.push(response.body.items.map(function(i){return i.id.videoId}))
                if ( i === foundEpisodes.length - 1 ){
                    console.log(videoIds)
                }
            })
        })
    })
    
    // 3. Get transcript for each episode (Dor's + Vicki's part)
    getTranscript(videoIds)
    

    // 5. Get video part for each word (Efrat's part)
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