
import assert from "assert";
import stringSimilarity from "string-similarity";
import db from './medalDB.js';

// getTextFromImage(fs.readFileSync('./image.png')).then(text => {
//     console.log(text);
// }).catch(err => {
//     console.log(err);
// })
 
//   (async () => {
//     const worker = await createWorker({
//         logger: m => console.log(m)
//       });
//     await worker.loadLanguage('eng');
//     await worker.initialize('eng');
//     const { data: { text } } = await worker.recognize('./IMG_2299.png');
//     console.log(text);
//     await worker.terminate();
// })();

export default async function parseMedalList(stringList: string) {
    console.log(stringList);
    const officialTrelloMedals = await db()
    // It looks like regex /\r\n|\r|\n/ handles CR, LF, and CRLF line endings, their mixed sequences, and keeps all the empty lines inbetween
    // See https://stackoverflow.com/a/52947649
    const rawListOfMedals = stringList.replace(/:[^:\s]*(?:::[^:\s]*)*:/g, '').split(/\r\n|\r|\n/).filter(e =>  e)
    console.log(rawListOfMedals)

    const joinedRawListOfMedals = rawListOfMedals.map((medalString, i) => {
        console.log(medalString, i);
        const medalQuantityRegex = new RegExp(/x[0-9]+/i)
        // incomplete medal fixer thanks to new lines in the sample
        if (!medalQuantityRegex.test(medalString) && rawListOfMedals[i + 1] !== null && medalQuantityRegex.test(rawListOfMedals[i + 1])) {
            medalString += rawListOfMedals[i + 1] 
            rawListOfMedals[i + 1] = ""
            return medalString;
        }
        return medalString;
    })
    console.log(rawListOfMedals, joinedRawListOfMedals)
    const listOfMedals = joinedRawListOfMedals.filter(e =>  e).map(s => s.trim()).filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});



    return listOfMedals.map((m) => {
        var rawMedal = m.replace(/ x\d/gm, '')
        const similarMedal = stringSimilarity.findBestMatch(rawMedal, officialTrelloMedals.map((m: { name: string; }) => m.name)).bestMatch
        // if (similarMedal.rating <= 0.35) return undefined;
        const medal = similarMedal.target
        const dbMedal = officialTrelloMedals.find(m => m.name === medal);
        assert(dbMedal !== undefined)
        const userQuantityOfMedals = Number(m.slice(-1));
        // Filtering out people that have impossible quantities of medals and instead defaulting to our db's maximum quantity
        if (dbMedal.quantity >= userQuantityOfMedals) dbMedal.quantity = userQuantityOfMedals
        return dbMedal;
    }).sort((a, b) => {
        return a.id - b.id;
      })
}
// parseMedalList(`:GoodConduct: Good Conduct Medal x3
// :BorderActivity~1: Border Activity Medal x3
// :DistinguishedService: Military Distinguished Service Medal x3
// :Longevity: Longevity Medal x3
// :Recruitment: Recruitment Medal x1
// :DistinctionInBattle: Distinction in Battle Medal x3
// :OrderCavdra: Order of Cavdra x1
// :CombatAction: Combat Action Medal x1
// :OrderVasilyev: Order of Vasilyev x1
// :GoldenStarOfValor: Golden Star of Valor x1
// :HeroFederationMil: Hero of the Immortal Federation's Military x1`
// ).then((results) => {
//     console.log(util.inspect(results, {showHidden: false, depth: null, colors: true}))
// })
