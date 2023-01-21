import { get } from "http";
import Trello from "trello";
import util from 'util';
import { promisify } from 'node:util';
import stream from 'node:stream';
import fs from 'node:fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { UserMedals } from './types';


function isMedalFormat(str: string) {
    // Matches 13. Combat Preparation Medal
    return str.includes(".")
}

export default async function getMedals(): Promise<UserMedals[]> {
    
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
if (__dirname.includes("build")) {
    __dirname = join(__dirname, "..", 'src')
}
else if (!__dirname.includes("src")) {
        __dirname = join(__dirname, "src")
}


    const trello = new Trello(process.env.API_KEY, process.env.USER_TOKEN);
    const trelloBoardID = process.env.TRELLO_BOARD as string
    const trelloLists = await trello.getListsOnBoard(trelloBoardID)
    // console.log(util.inspect(await trello.getCardsOnBoard(listID), {showHidden: false, depth: null, colors: true}))
    const trelloBoardMedalsList = await trelloLists.filter((l: { name: string; }) => isMedalFormat(l.name))

    const medals = await Promise.all(trelloBoardMedalsList.map(async (l: { id: number; name: string; }) => {
        const cardz = await trello.getCardsOnList(l.id)
        const cards = cardz.map((c: { name: string; }) => c.name)

        const adjudicatorString = "Adjudicator: "
        const eligibilityString = "Eligibility: "
        const regexResults = /[0-9]+/gm.exec(l.name)
        if (!regexResults?.length) {
            throw new Error("RegExp for the number/id of the medal failed")
        }
        const numba = Number(regexResults[0])
        const name = l.name.replace(/[0-9]+\. /gm, '')
        const IS_ORDER = numba <= 9;

        const medalz = IS_ORDER ? [join(__dirname, 'images', 'medals', name, `${name}.png`)] : [join(__dirname, 'images', 'medals', name, `${name} - GOLD.png`), join(__dirname, 'images', 'medals', name, `${name} - SILVER.png`), join(__dirname, 'images', 'medals', name, `${name} - BRONZE.png`)]
        for (const expectedFile of medalz) {
            const expectedMedalDir = dirname(expectedFile)
            if (!fs.existsSync(expectedMedalDir)) {
                fs.promises.mkdir(expectedMedalDir, {
                    recursive: true
                })
            }
            if (!fs.existsSync(expectedFile)) {
                console.warn(`${name} is missing ${expectedFile}`)
                const index = medalz.indexOf(expectedFile)
                if (index > -1) {
                    medalz.splice(index, 1)
                }
            }
        }
        const quantity = !IS_ORDER ? 3 : 1

        return {
            name,
            // better name for this?? in js index starts with 0. Ours starts with 1
            id: numba,
            description: cards.find((c: string) => !c.includes(adjudicatorString) && !c.toLowerCase().includes('preview') && !c.includes(eligibilityString) && !c.toLowerCase().includes('ribbon')),
            adjudicator: cards.find((c: string | string[]) => c.includes(adjudicatorString)).replace(adjudicatorString, ''),
            eligibility: cards.find((c: string | string[]) => c.includes(eligibilityString)).replace(eligibilityString, ''),
            type: IS_ORDER ? 'ORDER' : 'MEDAL',
            quantity,
            // If you think I gave up on this code, I did. This is probably the worst way I can do this, but it's 5:54 AM EST.
            medals: medalz

        }
    }))

    // console.log(util.inspect(medals, {showHidden: false, depth: null, colors: true}))

    return medals
}
export function getMedalImageIndex(medal: UserMedals) : number {
    var index;
    switch(medal.quantity) {
        case 3:
            index = 0 
          break;
        case 2:
          index = 1
          break;
        case 1:
        index = 2
        break;
        default:
          index = 0
      }
    return medal.type === 'ORDER' ? 0 : index
}
export async function getCitations() {
    const trello = new Trello(process.env.API_KEY, process.env.USER_TOKEN);
    const trelloBoardID = process.env.TRELLO_BOARD as string
    const trelloLists = await trello.getListsOnBoard(trelloBoardID)
}