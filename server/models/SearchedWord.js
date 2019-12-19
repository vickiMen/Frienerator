const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SearchedWordSchema = new Schema({
    word: String,
    matchedEpisodes: [
        {
            videoId: String,
            timeStamp: {
                start: String,
                duration: String
            }
        }
    ],
    isReady: Boolean
})

const SearchedWord = mongoose.model('SearchedWord', SearchedWordSchema)

module.exports = SearchedWord