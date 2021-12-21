import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    let p1_0 = parseInt(lines[0][lines[0].length - 1], 10)
    let p2_0 = parseInt(lines[1][lines[1].length - 1], 10)
    console.log("Pt1", pt1(p1_0, p2_0))

    let states = new Map() // score, position, steps, count
    let initial = new State(0, p1_0, 0, p2_0, BigInt(1))
    states.set(getKey(0, p1_0, 0, p2_0), initial)
    while (states.size !== 0) {
        states = step_pt2(states)
    }
    console.log("Pt2:", wins_p1 > wins_p2 ? wins_p1 : wins_p2)
}

let wins_p1 = BigInt(0)
let wins_p2 = BigInt(0)
function step_pt2(states) {
    let statesNext = new Map()
    for (let state of states.values()) {
        if (state.score_p1 >= 21 || state.score_p2 >= 21) {
            continue
        }
        let numbers = [1, 2, 3]
        // permutations p1
        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                for (let k = 0; k < numbers.length; k++) {
                    let sum1 = numbers[i] + numbers[j] + numbers[k]
                    let pos_p1_next = getPos(state.pos_p1, sum1)
                    let score_p1_next = state.score_p1 + pos_p1_next
                    if (score_p1_next >= 21) {
                        wins_p1 += state.count
                    } else {
                        // permutations p2
                        for (let l = 0; l < numbers.length; l++) {
                            for (let m = 0; m < numbers.length; m++) {
                                for (let n = 0; n < numbers.length; n++) {
                                    let sum2 = numbers[l] + numbers[m] + numbers[n]
                                    let pos_p2_next = getPos(state.pos_p2, sum2)
                                    let score_p2_next = state.score_p2 + pos_p2_next
                                    let key = getKey(score_p1_next, pos_p1_next, score_p2_next, pos_p2_next)
                                    if (score_p2_next >= 21) {
                                        wins_p2 += state.count
                                    } else {
                                        if (statesNext.has(key))
                                            statesNext.get(key).count += state.count
                                        else
                                            statesNext.set(key, new State(score_p1_next, pos_p1_next, score_p2_next, pos_p2_next, state.count))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return statesNext
}

function pt1(p1_0, p2_0) {
    let p1 = p1_0
    let p2 = p2_0
    let s1 = 0
    let s2 = 0
    let steps = 0
    let nextDie = 0
    while (s2 < 1000) {
        steps++
        p1 = getScore(p1, nextDie)
        s1 += p1
        nextDie = (nextDie + 3) % 100
        if (nextDie === 0)
            nextDie = 100
        if (s1 >= 1000)
            break
        p2 = getScore(p2, nextDie)
        s2 += p2
        nextDie = (nextDie + 3) % 100
        if (nextDie === 0)
            nextDie = 100
    }
    let rolls = steps * 6 - ((s1 >= 1000) ? 3 : 0)
    let lScore = (s1 >= 1000) ? s2 : s1
    return rolls * lScore
}

let scores = new Map()
function getScore(p, nextDie) {
    let key = "" + p + nextDie
    if (scores.has(key))
        return scores.get(key)
    let dieVal = 0
    for (let i = 1; i <= 3; i++) {
        dieVal += nextDie + i
    }
    let result = getPos(p, dieVal)
    scores.set(key, result)
    return result

}

function getPos(p, dieVal) {
    let result = (p + dieVal) % 10
    if (result === 0)
        result = 10
    return result
}

class State {
    constructor(score_p1, pos_p1, score_p2, pos_p2, count) {
        this.score_p1 = score_p1
        this.pos_p1 = pos_p1
        this.score_p2 = score_p2
        this.pos_p2 = pos_p2
        this.count = count
    }
}

function getKey(score_p1, pos_p1, score_p2, pos_p2) {
    return [score_p1, pos_p1, score_p2, pos_p2].join(',')
}