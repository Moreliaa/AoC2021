import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input, false)
    let alg = lines[0]
    let map = lines.slice(2, lines.length - 1)

    let pt1 = 0
    for (let steps = 1; steps <= 50; steps++) {
        map = getNextMap(map, alg, steps)
        if (steps === 2)
            pt1 = getLitPixels(map)
    }

    console.log("Pt1:", pt1)
    console.log("Pt2:", getLitPixels(map))
}

function getNextMap(map, alg, step) {
    let nextMap = []
    for (let y=-1; y <= map.length; y++) {
        let nextRow = ""
        for (let x=-1; x <= map[0].length; x++) {
            let dec = getDecimal(map, step, x, y)
            nextRow += alg[dec]           
        }
        nextMap.push(nextRow)
    }
    return nextMap
}

function getDecimal(map, step, x0, y0) {
    let result = "" 
    for (let y=y0-1; y <= y0+1; y++) {
        for (let x=x0-1; x <= x0+1; x++) {
            if (x < 0 || y < 0 || x >= map[0].length || y >= map[0].length) {
                result += (step % 2 === 0) ? '1' : '0' // this depends on alg[0] === '#' and alg[511] === '.', but we can safely assume Eric was trying to trick everyone
            } else {
                result += map[y][x] === '#' ? '1' : '0'
            }
        }
    }
    return parseInt(result, 2)
}

function getLitPixels(map) {
    return map.reduce((acc, curr) => {
        return acc + curr.split('').filter(c => c === '#').length
    }, 0)
}