export function solve (input) {
    let lines = input.split(/\n/).map(i => parseInt(i, 10)).filter(i => !isNaN(i))
    let count = 0
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] > lines[i-1])
            count++
    }
    console.log("Pt1: " + count)

    count = 0
    let prev = null
    let curr = null
    for (let i = 1; i < lines.length - 1; i++) {
        curr = lines[i-1] + lines[i] + lines[i+1]
        if (prev !== null && curr > prev)
            count++
        prev = curr
    }
    console.log("Pt2: " + count)
}