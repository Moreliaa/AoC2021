import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input, false)
    let points = lines.slice(0, lines.indexOf(""))
    let instructions = lines.slice(lines.indexOf("")).filter(l => l !== "").map(l => l.split(' ')[2].split("="))
    let map = new Map()
    for (let p of points) {
        let coords = p.split(",").map(c => parseInt(c, 10))
        map.set(p, coords)
    }

    for (let i = 0; i < instructions.length; i++) {
        map = fold(map, instructions[i])
        if (i === 0)
            console.log("Pt1:", map.size)
    }

    let x_max = 0
    let y_max = 0
    map.forEach((val, key, map) => {
        x_max = Math.max(val[0], x_max)
        y_max = Math.max(val[1], y_max)
    })

    console.log('Pt2:')
    let line = ""
    for (let y = 0; y <= y_max; y++) {
        for (let x = 0; x <= x_max; x++) {
            line += map.has(Util.map_getKey(x, y)) ? '#' : '.'
        }
        line += '\n'
    }
    console.log(line)
}

function fold(map, instruction) {
    let coord = parseInt(instruction[1], 10)
    if (instruction[0] === 'x') {
        let map_new = new Map()
        map.forEach((val, key, map) => {
            if (val[0] > coord) {
                let x_new = val[0] - 2 * (val[0] - coord)
                let y_new = val[1]
                map.set(Util.map_getKey(x_new, y_new), [x_new, y_new])
            } else {
                map_new.set(key, val)
            }
        })
        map = map_new

    } else { // y
        let map_new = new Map()
        map.forEach((val, key, map) => {
            if (val[1] > coord) {
                let x_new = val[0]
                let y_new = val[1] - 2 * (val[1] - coord)
                map.set(Util.map_getKey(x_new, y_new), [x_new, y_new])
            } else {
                map_new.set(key, val)
            }
        })
        map = map_new
    }
    return map
}