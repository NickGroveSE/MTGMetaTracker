const express = require('express')
const router = express.Router()
const Archetype = require('../models/archetype')

router.get('/', (req, res) => {
    res.render('format/index')
})

// Routing to the page that lists out the top archetypes in a Format
router.get('/:format', async (req,res) =>{
    const formatUpper = req.params.format.charAt(0).toUpperCase() + req.params.format.slice(1)
    try {
        const archetypes = await Archetype.find({format: formatUpper})
        res.render(`format/${req.params.format}`, {archetypes: archetypes})
    } catch (err) {
        res.redirect('/')
    }
})

// Routing to the page for a specific archetype
router.get('/:format/:name', async (req, res) => {

    let archetype
    const nameWithSpace = req.params.name.replace("-", " ")
    try {
        archetype = await Archetype.find({name: nameWithSpace})
        console.log()
        res.render(`format/${req.params.format}/show`, {archetype: archetype[0]})
    } catch {
        res.redirect('/')
    }
})

module.exports = router