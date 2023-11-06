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
            url: `https://www.mtggoldfish.com/metagame/${formats[i]}/full#paper`,
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
            const isInstanceSaved = await Archetype.find(({name: locateArchetypeName(archetypeElement, j), format: currentFormat, colors: locateColorIdentity(archetypeElement, j)}))

            // Initialize DataPoint
            var dataPoint = new DataPoint(
                new Date(), 
                parseFloat(locateArchetypeMetaPercentage(archetypeElement, j).value.replace('%', '')).toFixed(1), 
                parseInt(locateArchetypePrice(archetypeElement, j).replace('$', '').replace(',', ''))
            )

            
            // If New Archetype, Else Push DataPoint
            if (isInstanceSaved.length == 0) {

                // Create New Instance of Archetype Model
                var instance = new Archetype({
                    name: locateArchetypeName(archetypeElement, j), 
                    format: currentFormat,
                    colors: locateColorIdentity(archetypeElement, j), 
                    meta_change: "+/-0",
                    price_change: "+/- 0",
                    data: [{
                        date: dataPoint.date, 
                        meta: dataPoint.meta, 
                        price: dataPoint.price
                    }]
                })

                // Save Archetype
                instance.save()

            } else {

                // Initialize the Last Data Entry, Call Function to Calculate Increases and Decreases from Last Week
                const lastDataEntry = isInstanceSaved[0].data[isInstanceSaved[0].data.length - 1]
                const change = differenceCalc(lastDataEntry, dataPoint)

                // Push New Data Onto Existing Archetype, Change Increases or Decreases in Data
                const pushResponse = await Archetype.updateOne(
                    {'name': isInstanceSaved[0].name, 'format': currentFormat},
                    {'meta_change': change[0],
                    'price_change': change[1],
                    '$push': {'data': [{
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
        .childNodes[4]
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

// Traverse to Colors
function locateColorIdentity(archetypes, position) {
    
    // Try/Catch for Finding Color Identity, so If this catches We Know that the Archetype is Colorless
    try {
        return archetypes.childNodes[position]
            .childNodes[1]
            .childNodes[0]
            .childNodes[1]
            .childNodes[0]
            .attrs[2]
            .value
            .replace("colors: ", "")
            .replace("white", "W")
            .replace("blue", "U")
            .replace("black", "B")
            .replace("red", "R")
            .replace("green", "G")
    } catch (error) {
        return "C"
    }

}

// Calculations for Increases and Decreases Between Weeks
function differenceCalc(lastEntry, currentEntry) {

    // Initialize our Arrays
    // statChange is for our numerical values, and displayChange is the Strings of these values to be displayed in the DB
    var statChange = [currentEntry.meta - lastEntry.meta, currentEntry.price - lastEntry.price]
    var displayChange = []

    // Loop Through statChange, Therefore going through the changes in Meta and Price
    for (let i = 0; i < statChange.length; i++) {
        switch (true) {
            case (statChange[i] == 0):
                if (i == 0) {
                    displayChange[i] = "+/-0"
                } else {
                    displayChange[i] = "+/- 0"
                }
                break
            case (statChange[i] > 0):
                if (i == 0) {
                    displayChange[i] = "+" + statChange[i].toFixed(1).toString()
                } else {
                    displayChange[i] = "+ " + statChange[i].toFixed(0).toString()
                }
                break
            case (statChange[i] < 0):
                if (i == 0) {
                    displayChange[i] = statChange[i].toFixed(1).toString()
                } else {
                    displayChange[i] = statChange[i].toFixed(0).toString().slice(0, 1) + " " + statChange[i].toFixed(0).toString().slice(1)
                }
                break
        }
    }

    return displayChange;

}

module.exports = { scrape }