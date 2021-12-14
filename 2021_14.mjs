import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input, false)
    let template = lines[0]

    let rules = new Map()
    for (let i = 2; i < lines.length - 1; i++) {
        let l = lines[i]
        rules.set(l.slice(0, 2), [l.slice(0, 1) + l[l.length - 1], l[l.length - 1] + l.slice(1, 2)])
    }

    let pairs = new Map()
    for (let i = 0; i < template.length - 1; i++) { 
        let pair = template.slice(i, i + 2)
        if (pairs.has(pair))
            pairs.set(pair, pairs.get(pair) + 1)
        else
            pairs.set(pair, 1)
    }

    let steps = 0
    let target_pt1 = 10
    let target_pt2 = 40
    let counts = initCounts(template)

    while (steps < target_pt2) {
        steps++
        let pairs_next = new Map()
        for (let rule of rules.entries()) {
            if (!pairs.has(rule[0]))
                continue
            let count = pairs.get(rule[0])

            if (steps === target_pt1 || steps === target_pt2) {
                for (let c of rule[1][0]) {
                    if (counts.has(c))
                        counts.set(c, counts.get(c) + count)
                    else
                        counts.set(c, count)
                }
            }

            for (let target of rule[1]) {
                if (pairs_next.has(target))
                    pairs_next.set(target, pairs_next.get(target) + count)
                else
                    pairs_next.set(target, count)
            }
        }
        pairs = pairs_next
        if (steps === target_pt1) {
            console.log("Pt1:", calcResult(counts))
            counts = initCounts(template)
        }
    }
    console.log("Pt2:", calcResult(counts))
}

function initCounts(template) {
    let counts = new Map()
    counts.set(template[template.length - 1], 1)
    return counts
}

function calcResult(counts) {
    return Math.max(...counts.values()) - Math.min(...counts.values())
}