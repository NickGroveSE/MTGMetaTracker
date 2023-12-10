const express = require('express')
const router = express.Router()
const Archetype = require('../models/archetype')

// Routing to the page that lists out the top archetypes in a Format
router.get('/:format', async (req,res) =>{
    const formatUpper = req.params.format.charAt(0).toUpperCase() + req.params.format.slice(1)
    try {
        const archetypes = await Archetype.find({format: formatUpper}).sort({"data.meta": -1})

        res.render(`format/${req.params.format}`, {archetypes: archetypes.slice(0,30)})
    } catch (err) {
        res.redirect('/')
    }
})

// Routing to the page for a specific archetype
router.get('/:format/:name', async (req, res) => {

    let archetype
    const nameColorSeparation = req.params.name.split("*")
    const name = nameColorSeparation[0].split("_").join(" ")
    const colors = nameColorSeparation[1].split('').join(' ')

    try {
        archetype = await Archetype.find({name: name, format: req.params.format.charAt(0).toUpperCase() + req.params.format.slice(1), colors: colors})
        res.render(`format/${req.params.format}/show`, {archetype: archetype[0]})
    } catch {
        res.redirect('/')
    }

})

module.exports = router