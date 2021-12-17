import Util from './util.mjs'

export function solve(input) {
    let target = Util.splitLines(input)[0]
    let rx = /target area: x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/
    let match = target.match(rx)
    let xMin = parseInt(match[1], 10)
    let xMax = parseInt(match[2], 10)
    let yMin = parseInt(match[3], 10)
    let yMax = parseInt(match[4], 10)

    let pt1 = 0
    let pt2 = 0
    for (let v_x = -700; v_x < 700; v_x++) {
        for (let v_y = -700; v_y < 115; v_y++) {
            let result = attempt(v_x, v_y, xMin, xMax, yMin, yMax)
            pt1 = Math.max(result[1], pt1)
            if (result[0])
                pt2++
        }
    }
    console.log("Pt1:", pt1)
    console.log("Pt2:", pt2)
}

function attempt(v_x, v_y, xMin, xMax, yMin, yMax) {
    let x = 0
    let y = 0
    let max_y_reached = 0
    let set = new Set()
    while (y >= yMin) {
        let result = step(x, y, v_x, v_y)
        set.add(Util.map_getKey(x, y))
        x = result[0]
        y = result[1]
        max_y_reached = Math.max(y, max_y_reached)
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
            //printStuff(set, xMin, xMax, yMin, yMax, x, max_y_reached, y)
            return [true, max_y_reached]
        }
        v_x = result[2]
        v_y = result[3]
    }
    //printStuff(set, xMin, xMax, yMin, yMax, x, max_y_reached, y)
    return [false, 0]
}

function printStuff(set, xMin, xMax, yMin, yMax, max_x_reached, max_y_reached, yEnd) {
    /*for (let y = max_y_reached; y >= yEnd; y--) {
        let line = ""
        for (let x = 0; x <= max_x_reached; x++) {
            line += set.has(Util.map_getKey(x, y)) ? "#" : (x >= xMin && x <= xMax && y >= yMin && y <= yMax) ? "T" : "."
        }
        console.log(line)
    }*/
    console.log(max_x_reached, max_y_reached, yEnd)
}

function step(x, y, v_x, v_y) {
    x += v_x
    y += v_y
    v_x -= v_x === 0 ? 0 : v_x / Math.abs(v_x)
    v_y -= 1
    return [x, y, v_x, v_y]
}