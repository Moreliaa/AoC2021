import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input).map(i => {
        let result = i.split(" ")
        result[1] = parseInt(result[1], 10)
        return result
    })

    let depth = lines.reduce((total, line) => (line[0] === "forward") ? total + line[1] : total, 0)
    let pos = lines.reduce((total, line) => {
        if (line[0] === "up")
            return total - line[1]
        else if (line[0] === "down")
            return total + line[1]
        return total
    }, 0)
    console.log(`Pt1: ${depth * pos}`)

    let aim = 0
    pos = 0
    depth = lines.reduce((total, line) => {
        if (line[0] === "up")
            aim -= line[1]
        else if (line[0] === "down")
            aim += line[1]
        else if (line[0] === "forward") {
            pos += line[1]
            return total + aim * line[1]
        }
        return total
    }, 0)
    console.log(`Pt2: ${depth * pos}`)
}