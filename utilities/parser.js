const parse5 = require('parse5')
const axios = require('axios')
var DataPoint = require('./data-point.js')
// const ArchetypeModel = require('../models/archetype')

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
    var archetypes = []

    // Loop Through All Archetypes
    // Print Archetype Name, Meta %, and Price
    for (let i = 0; i < archetypeElement.childNodes.length; i++) {
        var dataPoint = new DataPoint(new Date(), locateArchetypeMetaPercentage(archetypeElement, i), locateArchetypePrice(archetypeElement, i))
        console.log(dataPoint)
        //var instance = new archetype_model
    }


}

(async () => {
    await performScraping()
})()

// Calling our Get Request Function
performScraping()


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
        .childNodes[0].value

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