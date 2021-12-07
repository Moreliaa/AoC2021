import Util from './util.mjs'

export function solve(input) {
    let crabs = Util.splitLines(input)[0].split(',').map(n => parseInt(n, 10))
    crabs.sort()
    let pos = Math.min(...crabs)
    let cost = getCost(crabs, pos)
    let minCost;
    do {
        pos++
        minCost = cost
        cost = getCost(crabs, pos)
    } while (cost <= minCost)
    console.log("Pt1: ", minCost)

    pos = Math.min(...crabs)
    let maxPos = Math.max(...crabs)
    cost = getCostPt2(crabs, pos)
    minCost = null
    do {
        pos++
        cost = getCostPt2(crabs, pos)
        if (minCost === null || minCost > cost)
            minCost = cost
    } while (pos <= maxPos)
    console.log("Pt2: ", minCost)
}

function getCost(crabs, pos) {
    return crabs.reduce((acc, crab) => acc + Math.abs(crab - pos), 0)
}

function getCostPt2(crabs, pos) {
    return crabs.reduce((acc, crab) => {
        let diff = Math.abs(crab - pos)
        return acc + diff * (diff + 1) / 2
    }, 0)
}