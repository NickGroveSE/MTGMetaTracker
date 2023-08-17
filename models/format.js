const mongoose = require('mongoose')

const formatSchema = new mongoose.Schema({
    name: String,
    description: String,
    startingSet: String
})