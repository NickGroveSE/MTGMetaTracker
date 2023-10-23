const mongoose = require('mongoose')

// The Archetype Schema is used to store a deck type
// It consists of its Name, Format, and The Data Needed for the Data Visualization
const archetypeSchema = new mongoose.Schema({
    name: String,
    format: String,
    data: [{
        _id: false,
        date: String,
        meta: Number,
        price: Number
    }]
})

module.exports = mongoose.model("Archetype", archetypeSchema)