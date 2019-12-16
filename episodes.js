const mongoose = require('mongoose')

const Schema = mongoose.Schema

const EpisodeSchema = new Schema({
    season: String,
    episode: String,
    name: String,
    script: String
})

const Episode = mongoose.model('episode', EpisodeSchema)

module.exports = Episode