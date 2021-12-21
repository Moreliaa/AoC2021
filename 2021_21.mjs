import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    let p1_0 = parseInt(lines[0][lines[0].length - 1], 10)
    let p2_0 = parseInt(lines[1][lines[1].length - 1], 10)
    p1_0 = 4
    p2_0 = 8


    console.log("Pt1", pt1(p1_0, p2_0))

    let states = new Map() // score, position, steps, count
    let initial = new State(0, p1_0, 0, p2_0, 0, 1)
    states.set(getKey(0, p1_0, 0, p2_0, 0), initial)
    while (!eachStateWon(states)) {
        states = step_pt2(states)
    }
    console.log("Pt2:", result_pt2(states))
    // do same for p2  
}

function result_pt2(states) {
    let total_p1 = 0
    let total_p2 = 0
    for (let state of states.values()) {
        if (state.score_p1 >= 21)
            total_p1 += state.count
        if (state.score_p2 >= 21 && state.score_p1 < 21)
            total_p2 += state.count
    }
    return Math.max(total_p1, total_p2)
}

function eachStateWon(states) {
    for (let state of states.values()) {
        if (state.score_p1 < 21 && state.score_p2 < 21)
            return false
    }
    return true
}

function step_pt2(states) {
    let statesNext = new Map()
    for (let state of states.values()) {
        if (state.score_p1 >= 21 || state.score_p2 >= 21)
            continue
        let numbers = [1, 2, 3]
        // permutations p1
        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                for (let k = 0; k < numbers.length; k++) {
                    let sum = numbers[i] + numbers[j] + numbers[k]
                    let posNextP1 = getPos(state.pos_p1, sum)
                    let scoreNextP1 = state.score_p1 + posNextP1
                    // permutations p2
                    for (let l = 0; l < numbers.length; l++) {
                        for (let m = 0; m < numbers.length; m++) {
                            for (let n = 0; n < numbers.length; n++) {
                                let sum2 = numbers[l] + numbers[m] + numbers[n]
                                let posNextP2 = getPos(state.pos_p2, sum2)
                                let scoreNextP2 = state.score_p2 + posNextP2
                                let key = getKey(scoreNextP1, posNextP1, scoreNextP2, posNextP2, state.steps + 1)
                                if (statesNext.has(key))
                                    statesNext.get(key).count += state.count
                                else
                                    statesNext.set(key, new State(scoreNextP1, posNextP1, scoreNextP2, posNextP2, state.steps + 1, state.count))
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
        console.log("p1", p1, "p2", p2, "next", nextDie)
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
    constructor(score_p1, pos_p1, score_p2, pos_p2, steps, count) {
        this.score_p1 = score_p1
        this.pos_p1 = pos_p1
        this.score_p2 = score_p2
        this.pos_p2 = pos_p2
        this.steps = steps
        this.count = count
    }
}

function getKey(score_p1, pos_p1, score_p2, pos_p2, steps) {
    return [score_p1, pos_p1, score_p2, pos_p2, steps].join(',')
}