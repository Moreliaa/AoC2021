import Util from './util.mjs'

export function solve(input) {
    let fish = Util.splitLines(input)[0].split(',').map(n => parseInt(n, 10))
    let fish_m = new Map()
    for (let f of fish) {
        let key = f
        if (!fish_m.has(key))
            fish_m.set(key, 1)
        else
            fish_m.set(key, fish_m.get(key) + 1)
    }
    let interval = 6
    let incr = interval + 2
    let days = 0
    let targetPt1 = 80
    let targetPt2 = 256
    while (days < targetPt2) {
        days++
        let next_m = new Map()
        for (let f of fish_m.keys()) {
            next_m.set(f - 1, fish_m.get(f))
        }
        if (next_m.has(-1)) {
            let count = next_m.get(-1)
            if (!next_m.has(interval))
                next_m.set(interval, count)
            else
                next_m.set(interval, next_m.get(interval) + count)
            next_m.set(incr, count)
            next_m.delete(-1)
        }
        fish_m = next_m
        if (days === targetPt1)
            console.log("Pt1: ", getTotal(fish_m))
    }
    console.log("Pt2: ", getTotal(fish_m))
}

function getTotal(fish_m) {
    let total = 0
    for (let f of fish_m.keys()) {
        total += fish_m.get(f)
    }
    return total
}