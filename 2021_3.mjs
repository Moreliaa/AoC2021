import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    let res = lines.reduce((bits, line) => {
        if (!bits)
            return line.split('').map(c => c === "1" ? 1 : -1)
        else
            return line.split('').map((c, idx) => c === "1" ? ++bits[idx] : --bits[idx])
    }, null)
    res = res.map(b => b > 0 ? "1" : "0")
    let gam = parseInt(res.join(''), 2)
    let eps = parseInt(res.map(c => c === "1" ? "0" : "1").join(''), 2)
    console.log("Pt1", gam * eps)

    let oxy = getRating(lines.slice(), filterOxy)
    let co2 = getRating(lines.slice(), filterCO2)
    console.log("Pt2", oxy * co2)
}

function filterOxy(line, sum, idx) {
    return (sum >= 0 && line[idx] === "1") || (sum < 0 && line[idx] === "0")
}

function filterCO2(line, sum, idx) {
    return (sum >= 0 && line[idx] === "0") || (sum < 0 && line[idx] === "1")
}

function getRating(lines, filterFunction) {
    let idx = 0
    while (lines.length > 1 && idx < lines[0].length) {
        let sum = lines.reduce((total, line) => line[idx] === "1" ? ++total : --total, 0)
        lines = lines.filter((line) => filterFunction(line, sum, idx))
        idx++
    }
    return parseInt(lines[0], 2)
}