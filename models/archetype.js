const mongoose = require('mongoose')
var DataPoint = require('../utilities/data-point')

const archetypeSchema = new mongoose.Schema({
    name: String,
    format: String,
    data: [{DataPoint}]
})

const ArchetypeModel = mongoose.model('Archetype', archetypeSchema)