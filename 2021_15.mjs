import Util from './util.mjs'

export function solve(input) {
    let map = Util.splitLines(input).map(line => line.split('').map(n => parseInt(n, 10)))
    let target_x = map[0].length - 1
    let target_y = map.length - 1
    console.log("Pt1:", dijkstra(map, target_x,target_y))
    target_x = map[0].length * 5 - 1
    target_y = map.length * 5 - 1 
    console.log("Pt2:", dijkstra(map, target_x,target_y))
}

function dijkstra(map, target_x, target_y) {
    let seen = new Set()
    let unseen = new Set()
    let minRisk = new Map()
    let x = 0
    let y = 0
    let quit = false
    while (!quit) {
        let key = Util.map_getKey(x, y)
        seen.add(key)
        unseen.delete(key)
        let currentRisk = minRisk.has(key) ? minRisk.get(key) : 0 // 0 = initial node
        let dirs = getDirs(x, y,target_x,target_y)
        for (let dir of dirs) {
            setRisk(map, minRisk, dir[0], dir[1], currentRisk)
            let dirKey = Util.map_getKey(dir[0], dir[1])
            if (!seen.has(dirKey))
                unseen.add(dirKey)
            if (dir[0] === target_x && dir[1] === target_y)
                quit = true
        }
        let next = getNextNode(unseen, minRisk)
        let next_coords = next[0].split(',').map(n => parseInt(n, 10))
        x = next_coords[0]
        y = next_coords[1]
    }
    return minRisk.get(Util.map_getKey(target_x, target_y))
}

function getNextNode(unseen, minRisk) {
    let next = null
    for (let key of unseen.values()) {
        let risk = minRisk.get(key)
        if (next === null || risk < next[1])
            next = [key, risk]
    }
    return next
}

function setRisk(map, minRisk, x, y, currentRisk) {
    let newRisk = currentRisk + getRiskForCoord(map,x,y)
    let key = Util.map_getKey(x, y)
    if (minRisk.has(key) && newRisk >= minRisk.get(key))
        return
    minRisk.set(key, newRisk)
}

function getRiskForCoord(map, x, y) {
    let map_x = map[0].length
    let map_y = map.length
    let incr = 0
    while (x >= map_x) {
        x -= map_x
        incr++
    }
    while (y >= map_y) {
        y -= map_y
        incr++
    }
    let risk = map[y][x]
    while (incr > 0) {
        risk = risk + 1 > 9 ? 1 : ++risk
        incr--
    }
    return risk
}

function getDirs(x, y,target_x,target_y) {
    return [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]].filter(d => d[0] >= 0 && d[0] <= target_x && d[1] >= 0 && d[1] <= target_y)
}