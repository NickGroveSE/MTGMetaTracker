const parse5 = require('parse5')
const axios = require('axios')
var DataPoint = require('./data-point.js')
const ArchetypeModel = require('../models/archetype')

async function performScraping() {

    // Download Mtggoldfish using Axios (Currently just getting Pioneer)
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.mtggoldfish.com/metagame/pioneer#paper",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    // Remove Newlines and Parse
    const document = parse5.parse(axiosResponse.data.replace(/\n/gm, ""))

    // Retrieve Archetypes
    const archetypeElement = generateArchetypes(document)

    // Loop Through All Archetypes
    // Print Archetype Name, Meta %, and Price
    for (let i = 0; i < archetypeElement.childNodes.length; i++) {
        // console.log(locateArchetypePrice(archetypeElement, i).replace('$', ''))
        var dataPoint = new DataPoint(
            new Date(), 
            parseFloat(locateArchetypeMetaPercentage(archetypeElement, i).value.replace('%', '')), 
            parseInt(locateArchetypePrice(archetypeElement, i).replace('$', ''))
        )
        var instance = new ArchetypeModel({
            name: locateArchetypeName(archetypeElement, i), 
            format: "Pioneer", 
            data: [{
                date: dataPoint.date, 
                meta: dataPoint.meta, 
                price: dataPoint.price}]
        })
        console.log(instance)
    }


}

(async () => {
    await performScraping()
})()

// Traverse to Archetypes
function generateArchetypes(doc) {
    return doc.childNodes[1]
        .childNodes[1]
        .childNodes[2]
        .childNodes[0]
        .childNodes[6]
        .childNodes[0]
        .childNodes[1]
}

// Traverse to Archetype Name
function locateArchetypeName(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0].value

}

// Traverse to Archetype Meta Percentage
function locateArchetypeMetaPercentage(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[1]
        .childNodes[0]
        .childNodes[0]
        .childNodes[1]
        .childNodes[0]

}

// Traverse to Archetype Price
function locateArchetypePrice(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[1]
        .childNodes[1]
        .childNodes[0]
        .childNodes[1]
        .childNodes[0].value

}

module.exports = performScraping()