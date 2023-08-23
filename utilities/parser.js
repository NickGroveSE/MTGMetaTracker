const parse5 = require('parse5')
const axios = require('axios')
var DataPoint = require('./data-point.js')
const Archetype = require('../models/archetype')
const formats = ["pioneer" , "modern", "pauper"]

// Web Scraping Function
async function performScraping() {

    console.log("Beginning Weekly Updating of Archetypes.....")

    for (let i = 0; i < formats.length; i++) {

        var currentFormat = formats[i].charAt(0).toUpperCase() + formats[i].slice(1)
        console.log("Updating " + currentFormat)

        // Download Mtggoldfish using Axios (Currently just getting Pioneer)
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

        // Loop Through All Archetypes
        // Print Archetype Name, Meta %, and Price
        for (let j = 0; j < archetypeElement.childNodes.length; j++) {

            const isInstanceSaved = await Archetype.find(({name: {$regex: locateArchetypeName(archetypeElement, j)}, format: {$regex: currentFormat}}))

            // Initialize DataPoint
            var dataPoint = new DataPoint(
                new Date(), 
                parseFloat(locateArchetypeMetaPercentage(archetypeElement, j).value.replace('%', '')), 
                parseInt(locateArchetypePrice(archetypeElement, j).replace('$', ''))
            )

            if (isInstanceSaved.length == 0) {

                // console.log(isInstanceSaved[0].name)

                var instance = new Archetype({
                    name: locateArchetypeName(archetypeElement, j), 
                    format: currentFormat, 
                    data: [{
                        date: dataPoint.date, 
                        meta: dataPoint.meta, 
                        price: dataPoint.price
                    }]
                })

                instance.save()

            } else {

                const test = await Archetype.updateOne({'name': isInstanceSaved[0].name, 'format': currentFormat},{'$push': {'data': [{'date': 'test', 'meta': 1, 'price': 1}]}}, {upsert: true})

                // 64e52dd5c94bddd7883d8afa
                console.log(isInstanceSaved[0])

            }

            // Create Instance of Archetype Model

            // if (await Archetype.find({name: fakeName})) {
            //     console.log("Yes")
            // }
            
            
            // if (Archetype.findOne({name: Data}))
            // var instance = new Archetype({
            //     name: locateArchetypeName(archetypeElement, j), 
            //     format: currentFormat, 
            //     data: [{
            //         date: dataPoint.date, 
            //         meta: dataPoint.meta, 
            //         price: dataPoint.price
            //     }]
            // })

            // // Save Data
            // instance.save()

        }
    }

    console.log("Done")

}

function parse() {
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

module.exports = { parse }