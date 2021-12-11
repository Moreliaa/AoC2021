import Util from './util.mjs'

export function solve(input) {
    let map = Util.splitLines(input).map(l => l.split('').map(n => parseInt(n, 10)))

    let steps = 0
    let target_pt1 = 100
    let count_pt1 = 0
    let count_pt2 = 0
    while (true) {
        steps++
        let count = step(map)
        if (steps <= target_pt1)
            count_pt1 += count
        if (count === 100) {
            count_pt2 = steps
            break
        }
    }

    console.log("Pt1:", count_pt1)
    console.log("Pt2:", count_pt2)
}

function step(map) {
    let flashed = new Set()
    let flash_next = new Set()
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            incrEnergy(map, x, y, flash_next, flashed)
        }
    }

    let entries = flash_next.values()
    while (flash_next.size !== 0) {
        flash_next = new Set()
        for (let coords of entries) {
            for (let y = coords[1] -1; y <= coords[1] + 1; y++) {
                for (let x = coords[0] - 1; x <= coords[0] + 1; x++) {
                    if (flashed.has(Util.map_getKey(x, y)) || !isInBounds(map, x,y))
                        continue
                    incrEnergy(map, x, y, flash_next, flashed)
                }
            }
        }
        entries = flash_next.values()
    }

    for (let coords of flashed.values()) {
        map[parseInt(coords[2], 10)][parseInt(coords[0], 10)] = 0
    }
    return flashed.size
}

function incrEnergy(map, x, y, flash_next, flashed) {
    map[y][x] += 1
    if (map[y][x] > 9) {
        flash_next.add([x, y])
        flashed.add(Util.map_getKey(x,y))
    }
}

function isInBounds(map, x,y) {
    return x >= 0 && x < map[0].length && y >= 0 && y < map.length
}