import { UserMedals } from "./types";
import { createCanvas, loadImage, Image } from 'canvas';
import fs from 'node:fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getMedalImageIndex } from "./medalDB.js";


// This is psuedo code, none of this produces an actual tshirt
export default async function generateMedalShirt(medals: UserMedals[]) {
    var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
if (__dirname.includes("build")) {
    __dirname = join(__dirname, "..", 'src')
}
else if (!__dirname.includes("src")) {
        __dirname = join(__dirname, "src")
}

    const canvas = createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const background = await loadImage(join(__dirname, 'images','shirt.png'))
    ctx.drawImage(background, 0, 0)
    var line = 1;
    var x = 2
    var y = 40
    const medalsPerRow = 5
    const rowsOfMedals = []
    for (let i = 0; i < medals.length; i++) {
        if (!medals[i].medals.length) continue;
        const medalImage = await loadImage(medals[i].medals[getMedalImageIndex(medals[i])])
        ctx.drawImage(medalImage, x, y)
        if (x >= 48 && line === 1) {
            y += 8
            line += 1
            x = 2;
        }
        else {
        x += 7
        }
    }
    ctx.font = '18px Impact'
    ctx.rotate(0.1)
    ctx.fillText('STOLEN VALOR TYPE FLOW FR', 15, 50)

    return canvas.toBuffer()
}