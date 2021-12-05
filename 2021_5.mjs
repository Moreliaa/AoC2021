import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    let rx = new RegExp(/(\d+),(\d+) -> (\d+),(\d+)/)
    let coords = lines.map(l => {
        let m = l.match(rx)
        return {x1: parseInt(m[1], 10), y1: parseInt(m[2], 10),x2: parseInt(m[3], 10), y2: parseInt(m[4], 10)}
    })
    console.log("Pt1", solvePart(coords.filter(c => c.x1 === c.x2 || c.y1 === c.y2)))
    console.log("Pt2", solvePart(coords))
}

function solvePart(coords) {
    let map = new Map()
    for (let c of coords) {
        let x = c.x1
        let y = c.y1
        let slope = getSlope(c)
        let x_incr = getIncrement(c.x1, c.x2)
        let y_incr = getIncrement(c.y1, c.y2)

        while (!(x === c.x2 && y === c.y2)) {
            put(map, x, y)
            x = slope !== null ? x + x_incr : x
            y = slope !== null ? y + slope : y + y_incr
        }
        put(map, x, y)
    }
    let count = 0
    for (let val of map.values()) {
        if (val > 1)
            count++
    }
    return count
}

function getSlope(c) {
    if (c.x2 === c.x1)
        return null // null = vertical
    return (c.y2 - c.y1) / Math.abs(c.x2 - c.x1) 
}

function getIncrement(a1, a2) {
    return (a2 - a1) / Math.abs(a2 - a1)
}

function put(map, x, y) {
    let key = Util.map_getKey(x, y)
    if (!map.has(key))
        map.set(key, 1)
    else
        map.set(key, map.get(key) + 1)
}