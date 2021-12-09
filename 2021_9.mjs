import Util from './util.mjs'

export function solve(input) {
    let map = Util.splitLines(input).map(l => l.trim().split('').map(d => parseInt(d, 10)))
    let lowPoints = []
    let pt1 = 0
    for (let y=0; y < map.length; y++) {
        for (let x=0; x <map[0].length; x++) {
            if (isLowPoint(x,y, map)) {
                lowPoints.push([x, y])
                pt1 += map[y][x] + 1
            }
        }
    }

    console.log("Pt1:", pt1)
    console.log("Pt2:", pt2(map, lowPoints))
}

function isLowPoint(x, y, map) {
    return getDirs(map, x, y).reduce((result, d) => result && map[y][x] < map[d[1]][d[0]], true)
}

function getDirs(map, x, y) {
    return [[x, y-1],[x,y+1],[x-1,y],[x+1,y]].filter(d => map[d[1]] !== undefined && map[d[1]][d[0]] !== undefined)
}

function pt2(map, lowPoints) {
    let sizes = []
    for (let lp of lowPoints) {
        let seen = new Set()
        sizes.push(getSize(map, seen, lp[0], lp[1], 0))
    }
    sizes.sort((a,b) => a - b)
    return sizes.slice(sizes.length - 3).reduce((acc, curr) => acc * curr)
}

function getSize(map, seen, x, y, size) {
    let key = Util.map_getKey(x,y)
    if (seen.has(key))
        return size
    seen.add(key)

    if (map[y][x] === 9)
        return size

    for (let d of getDirs(map, x, y))
        size += getSize(map, seen, d[0], d[1], 0)
    return size + 1
}