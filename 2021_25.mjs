import Util from './util.mjs'

export function solve(input) {
    let map = Util.splitLines(input).map(l => l.split(''))
    let steps = 0
    let currMap
    let nextMap = map
    do {
        currMap = nextMap
        nextMap = move(move(currMap, '>'), 'v')
        steps++
    } while (!areMapsEqual(currMap, nextMap))
    console.log("Pt1:", steps)
 }
 
 function areMapsEqual(map1, map2) {
    for (let y=0;y < map1.length;y++) {
        for (let x=0;x < map1[0].length;x++) {
         if (map1[y][x] !== map2[y][x])
            return false
     }
    }
     return true
 }

 function move(map, direction) {
    let nextMap = map.map(l => l.slice())
    for (let y=0;y < map.length;y++) {
        for (let x=0;x < map[0].length;x++) {
            let c = map[y][x]
            if (c !== direction)
                continue
            let x1
            let y1
            if (direction === '>') {
                x1 = x + 1 >= map[0].length ? 0 : x + 1
                y1 = y
            } else { // 'v'
                x1 = x
                y1 = y + 1 >= map.length ? 0 : y + 1
            }
            let c1 = map[y1][x1]
            if (c1 === '.') {
                nextMap[y][x] = '.'
                nextMap[y1][x1] = direction
            }
        }
    }
    return nextMap
 }