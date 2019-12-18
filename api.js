const express = require('express')
const router = express.Router()
const request = require('request')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

const express = require('express')
const router = express.Router()
const request = require('request')
const Episode = require('../models/Episode')
const SearchedWord = require('../models/SearchedWord')
const fs = require('fs');
const execSync = require('child_process').execSync;

router.get('/getVideo/:sentence', (req, res) => {
    const sentenceToBuild = req.params.sentence;
    const wordsToLookUpArr = sentenceToBuild.split(' ');
    let promiseArr = []
    let videoIds = []
    // 1. Search for words in the episodes
    wordsToLookUpArr.forEach(word => {
        promiseArr.push(Episode.findOne(/*Some query*/))
    })
    // 2. Go to youtube API to get video IDs
    Promise.all(promiseArr)
    .then( matchedVideoInfo => {
        // const season = matchedVideoInfo.season //1
        // const episode = matchedVideoInfo.episode //11 , 
        matchedVideoInfo.forEach( videoInfo => {
            
            // const identifiers = generateIdentifiers(videoInfo)
            // Get id of each video the words is at
            
            const apiKey = 'AIzaSyAcvhgH1AvRAY3aFF6NUUdyD4xRBko0Rm8'
            router.request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=friends s${season}e${episode}&type=video&key=${apiKey}`, function(err, response){
                const matchedVideosIds = response.body.items.map(function(i){return i.id.videoId})
                res.send(matchedVideosIds)
            })
        })
    })
    // 3. Get transcript for each episode (Dor's part)
    getTranscript
    // 4. Process transcripts with (Vicki's algo)
    // 5. Get video part for each word (Efrat's part)
})
const getTranscript = () => {
}
module.exports = router

// const generateIdentifiers = function(videoInfo){
//     const season = videoInfo.season
//     const episode = videoInfo.episode
//     const permutations = [
//         /[Ff][Rr][Ii][Ee][Nn][Dd][Ss](\s*[\-\:\,]*\s*)[Ss]*[Ee]*[Aa]*[Ss]*[Oo]*[Nn]*(\s*[\-\:\,]*\s*)0*/ + season + /(\s*[\-\:\,Xx]*\s*)[Ee]*[Pp]*[Ii]*[Ss]*[Oo]*[Dd]*[Ee]*(\s*[\-\:\,]*\s*)*0*/ + episode,
//         /[Ff][Rr][Ii][Ee][Nn][Dd][Ss](\s*[\-\:\,]*\s*)[Ee]*[Pp]*[Ii]*[Ss]*[Oo]*[Dd]*[Ee]*(\s*[\-\:\,]*\s*)0*/ + episode + /(\s*[\-\:\,Xx]*\s*)[Ss]*[Ee]*[Aa]*[Ss]*[Oo]*[Nn]*(\s*[\-\:\,]*\s*)*0*/ + season
//     ]

//     return permutations
// }