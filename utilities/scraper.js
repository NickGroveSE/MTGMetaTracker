const parse5 = require('parse5')
const axios = require('axios')
var DataPoint = require('./data-point.js')
const Archetype = require('../models/archetype.js')
const formats = ["pioneer" , "modern", "pauper"]

// Web Scraping Function
async function performScraping() {

    console.log("Beginning Weekly Updating of Archetypes.....")

    // Looping Through All Formats
    for (let i = 0; i < formats.length; i++) {

        // Initialize Current Format
        var currentFormat = formats[i].charAt(0).toUpperCase() + formats[i].slice(1)
        console.log("Updating " + currentFormat)

        // Download Mtggoldfish using Axios
        const axiosResponse = await axios.request({
            method: "GET",
            url: `https://www.mtggoldfish.com/metagame/${formats[i]}#paper`,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
            }
        })

        // Remove Newlines and Parse
        const document = parse5.parse(axiosResponse.data.replace(/\n/gm, ""))

        // Retrieve Archetypes
        const archetypeElement = generateArchetypes(document)

        // Looping Through All Archetypes
        for (let j = 0; j < archetypeElement.childNodes.length; j++) {

            // Check for Any Archetypes Under This Name and Format, Later Used to See If This is a New or Existing Archetype
            const isInstanceSaved = await Archetype.find(({name: {$regex: locateArchetypeName(archetypeElement, j)}, format: {$regex: currentFormat}}))

            // Initialize DataPoint
            var dataPoint = new DataPoint(
                new Date(), 
                parseFloat(locateArchetypeMetaPercentage(archetypeElement, j).value.replace('%', '')), 
                parseInt(locateArchetypePrice(archetypeElement, j).replace('$', ''))
            )
            
            // If New Archetype, Else Push DataPoint
            if (isInstanceSaved.length == 0) {

                // Create New Instance of Archetype Model
                var instance = new Archetype({
                    name: locateArchetypeName(archetypeElement, j), 
                    format: currentFormat, 
                    data: [{
                        date: dataPoint.date, 
                        meta: dataPoint.meta, 
                        price: dataPoint.price
                    }]
                })

                // Save Archetype
                instance.save()

            } else {

                // Push New Data Onto Existing Archetype
                const pushResponse = await Archetype.updateOne(
                    {'name': isInstanceSaved[0].name, 'format': currentFormat},
                    {'$push': {'data': [{
                        'date': dataPoint.date, 
                        'meta': dataPoint.meta, 
                        'price': dataPoint.price
                    }]},}, 
                    {upsert: true})


            }

        }
    }

    console.log("Finished")

}

function scrape() {
    (async () => {
        await performScraping()
    })()
}

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

module.exports = { scrape }