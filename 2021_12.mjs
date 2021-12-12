import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input).map(l => l.split('-'))
    let map = new Map()
    for (let l of lines) {
        let n1 = l[0]
        let n2 = l[1]
        addNode(map, n1, n2)
        addNode(map, n2, n1)
    }

    let seen = []
    let results = []
    findPaths(map, 'start', seen, results, true)
    console.log("Pt1:", results.length)
    seen= []
    results = []
    findPaths(map, 'start', seen, results, false, false)
    console.log("Pt2:", results.length)

}

function addNode(map, n, c) {
    if (!map.has(n))
        map.set(n, new Node(n, [c]))
    else {
        map.get(n).connections.push(c)
    }
}

function findPaths(map, n, seen, results, isPt1, revisitedOnce) {
    let current = map.get(n)
    if (!current.isBig() && seen.indexOf(n) !== -1)
        if (isPt1)
            return
        else {
            if (!revisitedOnce && n !== 'start')
                revisitedOnce = true
            else
                return
        }

    seen.push(n)

    if (n === 'end') {
        results.push(seen)
        return
    }
    for (let c of current.connections) {
        findPaths(map, c, seen.slice(), results, isPt1, revisitedOnce)
    }
}

class Node {
    constructor(n, c) {
        this.name = n
        this.connections = c
    }
    
    isBig() {
        let c = this.name.charCodeAt(0)
        return 65 <= c && c <= 90
    }
}