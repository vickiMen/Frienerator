const express = require('express')
const router = express.Router()
const request = require('request')
const Episode = require('../models/Episode')
const SearchedWord = require('../models/SearchedWord')
// const fs = require('fs');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

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
    .then(foundWords => {
        foundWords.forEach(word => {
            // Get id of each video the words is at
        })
    })

    // 3. Get transcript for each episode (Dor's + Vicki's part)
    getTranscript(videoIds)

    // 5. Get video part for each word (Efrat's part)
    
})

router.get('/testTranscript', (req, res) => {
    const videoId = ['4_OvFVR5pNs', '1JVrynCAapg']
    getTranscript(videoId)
    res.end()
})

const getTranscript = (videoIds) => {
    let commands = ''
    const scriptsFolder = '../youtube_transcripts'
    videoIds.forEach(id => {
        commands = `${commands} youtube-dl --skip-download -o '%(id)s.%(ext)s' --write-auto-sub 'https://www.youtube.com/watch?v=${id}'`
        // console.log(commands)
    })

    // exec(commands, function(error, stdout, stderr){ 
    //     // callback(stdout); 
    //     console.log('stdout: ', stdout)
    // });
    
    execSync(`${commands}`, {stdio: 'inherit', cwd: scriptsFolder})
}

module.exports = router