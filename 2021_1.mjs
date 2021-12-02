import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLinesInt(input)
    let count = lines.reduce((total, curr, idx) => idx > 0 && curr > lines[idx - 1] ? ++total : total, 0)
    console.log("Pt1: " + count)

    count = 0
    let prev = null
    let curr = null
    for (let i = 1; i < lines.length - 1; i++) {
        curr = lines[i - 1] + lines[i] + lines[i + 1]
        if (prev !== null && curr > prev)
            count++
        prev = curr
    }
    console.log("Pt2: " + count)
}