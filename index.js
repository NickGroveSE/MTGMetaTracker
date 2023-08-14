const parse5 = require('parse5')
const axios = require('axios')

async function performScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.mtggoldfish.com/metagame/pioneer#paper",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }

        
    })

    const document = parse5.parse(axiosResponse.data.replace(/\n/gm, ""))

    const archetypes = generateArchetypes(document)

    for (let i = 0; i < archetypes.childNodes.length; i++) {
        console.log(locateArchetypeName(archetypes, i))
        console.group()
        console.log("Meta %:            " + locateArchetypeMetaPercentage(archetypes, i))
        console.log("Tabletop Price:  " + locateArchetypePrice(archetypes, i) + "\n")
        console.groupEnd()
    }

}

performScraping()

function generateArchetypes(doc) {
    return doc.childNodes[1]
        .childNodes[1]
        .childNodes[2]
        .childNodes[0]
        .childNodes[6]
        .childNodes[0]
        .childNodes[1]
}

function locateArchetypeName(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0]
        .childNodes[0].value

}

function locateArchetypeMetaPercentage(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[1]
        .childNodes[0]
        .childNodes[0]
        .childNodes[1]
        .childNodes[0].value

}

function locateArchetypePrice(archetypes, position) {

    return archetypes.childNodes[position]
        .childNodes[1]
        .childNodes[1]
        .childNodes[1]
        .childNodes[0]
        .childNodes[1]
        .childNodes[0].value

}
// const document = parse5.parse('<!DOCTYPE html><html><head></head><body><div id="me"><div id="u">Hello</div></div></body></html>')

// console.log(dig(document.childNodes[1].childNodes[1], 2).childNodes[0].value)

// function dig(doc, deepness) {

//     if(deepness == 1){
//         return doc.childNodes[0]
//     } else {
//         deepness--
//         return dig(doc.childNodes[0], deepness)
//     }

// }

