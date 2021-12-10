import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)

    let score_pt1 = 0
    let scores_pt2 = []
    for (let l of lines) {
        let stack = []
        let isCorrupt = false
        for (let i = 0; i < l.length; i++) {
            let c = l[i]
            if (['(', '[', '{', '<'].indexOf(c) !== -1)
                stack.push(c)
            else {
                let last = stack.pop()
                const bMap = { '(': ')', '[': ']', '{': '}', '<': '>' }
                if (i === 0 || c !== bMap[last]) {
                    const sMap = { ')': 3, ']': 57, '}': 1197, '>': 25137 }
                    score_pt1 += sMap[c]
                    isCorrupt = true
                    break
                }
            }
        }
        if (!isCorrupt) {
            let score = 0
            while (stack.length > 0) {
                let next = stack.pop()
                const sMap = { '(': 1, '[': 2, '{': 3, '<': 4 }
                score = score * 5 + sMap[next]
            }
            scores_pt2.push(score)
        }
    }
    scores_pt2.sort((a, b) => a - b)

    console.log("Pt1:", score_pt1)
    console.log("Pt2:", scores_pt2[Math.floor(scores_pt2.length / 2)])
}