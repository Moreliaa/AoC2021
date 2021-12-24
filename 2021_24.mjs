export function solve() {
    console.log("Pt1:", solvePart(true))
    console.log("Pt2:", solvePart(false))
}

function solvePart(isPart1) {
    let constants = [
        [1, 11, 8],
        [1, 14, 13],
        [1, 10, 2],
        [26, 0, 7],
        [1, 12, 11],
        [1, 12, 4],
        [1, 12, 13],
        [26, -8, 13],
        [26, -9, 10],
        [1, 11, 1],
        [26, 0, 2],
        [26, -5, 14],
        [26, -6, 6],
        [26, -12, 14]
    ]

    let zMap = new Map()
    zMap.set(0, 0)
    for (let digit = 0; digit < 14; digit++) {
        console.log(digit)
        let zNext = new Map()
        for (let zEntry of zMap.entries()) {
            for (let n = 1; n < 10; n++) {
                let zValue = compute(zEntry[0], n, constants[digit])
                let newNumber = zEntry[1] * 10 + n
                if (!zNext.has(zValue) || (isPart1 ? zNext.get(zValue) < newNumber : zNext.get(zValue) > newNumber))
                    zNext.set(zValue, newNumber)
            }
        }
        zMap = zNext
    }
    return zMap.get(0)
}

function compute(previous, input, constant) {
    let condition = ((previous % 26) + constant[1]) !== input
    let factor = condition ? 26 : 1
    let add = condition ? constant[2] + input : 0
    return Math.floor(previous / constant[0]) * factor + add
}