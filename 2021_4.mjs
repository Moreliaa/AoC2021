import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input, false)
    let numbers = lines[0].split(',').map(n => parseInt(n, 10))
    let boards = []
    let currentBoard = []
    let picked = []
    for (let i = 2; i < lines.length; i++) {
        let l = lines[i]
        if (l === "") {
            boards.push(currentBoard)
            picked.push(currentBoard.map(row => row.map(n => 0)))
            currentBoard = []
            continue
        }
        currentBoard.push(l.trim().split(/\s+/).map(n => parseInt(n, 10)))
    }
    console.log("Pt1: " + getWinningScore(numbers, boards, picked.map(row => row.slice()), true))
    console.log("Pt2: " + getWinningScore(numbers, boards, picked, false))

}

function getWinningScore(numbers, boards, picked, pt1 = true) {
    let lastScore = null
    let pastWinners = []
    for (let n of numbers) {
        for (let b_idx = 0; b_idx < boards.length; b_idx++) {
            let b = boards[b_idx]
            if (pastWinners.indexOf(b) !== -1)
                continue
            for (let i = 0; i < b.length; i++) { // rows
                for (let j = 0; j < b[0].length; j++) { // columns
                    if (b[i][j] === n) {
                        let p = picked[b_idx]
                        p[i][j] = 1
                        if (isWinner(p)) {
                            if (pt1)
                                return n * bScore(b, p)
                            else {
                                pastWinners.push(b)
                                lastScore = n * bScore(b, p)
                            }
                        }
                    }
                }
            }
        }
    }
    return lastScore
}

function bScore(b, p) {
    let b_flat = b.flat()
    let p_flat = p.flat()
    return b_flat.reduce((total, curr, idx) => p_flat[idx] === 0 ? total + curr : total, 0)
}

function isWinner(p) {
    for (let i = 0; i < p.length; i++) { // rows
        if (p[i].filter(n => n === 1).length === p[i].length)
            return true
    }

    for (let j = 0; j < p[0].length; j++) { // columns
        let count = p.reduce((total, row) => {
            total + row[j]
        }, 0)
        if (count === p.length)
            return true
    }
    return false
}