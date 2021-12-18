import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    let sum = lines.reduce((acc, curr) => calculateSum(acc, curr))

    console.log("Pt1", getMagnitude(sum))

    let sums = []
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            idx = 0
            sums.push(getMagnitude(calculateSum(lines[i], lines[j])))
            idx = 0
            sums.push(getMagnitude(calculateSum(lines[j], lines[i])))
        }
    }
    console.log("Pt2", Math.max(...sums))
}

let idx = 0

function getMagnitude(sum) {
    let total = 0
    let number = ""
    while (idx < sum.length) {
        let c = sum[idx]
        switch (c) {
            case "[":
                idx++
                number = getMagnitude(sum).toString()
                break
            case "]":
                total += parseInt(number, 10) * 2
                return total
            case ",":
                total += parseInt(number, 10) * 3

                number = ""
                break
            default:
                number += c
        }
        idx++
    }
    return parseInt(number, 10)
}

function calculateSum(acc, curr) {
    let result = "[" + acc + "," + curr + "]"
    let reduceSum = false
    do {
        reduceSum = false
        let nestingLevel = 0
        let currentNumber = ""
        let currentNumberStartIdx = null
        let finishedExplodes = false
        for (let i = 0; i < result.length; i++) {
            let c = result[i]
            switch (c) {
                case "[":
                    nestingLevel++
                    if (nestingLevel === 5) {
                        // explode
                        reduceSum = true
                        let j = i + 1
                        let next = result[j]
                        let sustring = ""
                        while (next !== "]") {
                            sustring += next
                            next = result[++j]
                        }
                        let numbers = sustring.split(",").map(n => parseInt(n, 10))
                        result = result.slice(0, i) + "0" + result.slice(j + 1)
                        // search right
                        j = i + 1
                        let numberStartIdx = null
                        let number = ""
                        while (j < result.length) {
                            if (['[', ']', ','].indexOf(result[j]) === -1) {
                                if (numberStartIdx === null)
                                    numberStartIdx = j
                                number += result[j]
                            } else if (number !== "")
                                break
                            j++
                        }
                        if (number !== "")
                            result = result.slice(0, numberStartIdx) + (numbers[1] + parseInt(number, 10)) + result.slice(j)

                        // search left
                        j = i - 1
                        let numberEndIdx = null
                        number = ""
                        while (j >= 0) {
                            if (['[', ']', ','].indexOf(result[j]) === -1) {
                                if (numberEndIdx === null)
                                    numberEndIdx = j
                                number += result[j]
                            } else if (number !== "")
                                break
                            j--
                        }
                        if (number !== "") {
                            number = number.split('').reverse().join('')
                            result = result.slice(0, j + 1) + (numbers[0] + parseInt(number, 10)) + result.slice(numberEndIdx + 1)
                        }
                    }
                    break
                case "]":
                    if (finishedExplodes && currentNumber !== "" && parseInt(currentNumber, 10) >= 10) {
                        // split
                        reduceSum = true
                        let val = parseInt(currentNumber, 10)
                        let insertion = "[" + Math.floor(val / 2) + "," + Math.ceil(val / 2) + "]"
                        result = result.slice(0, currentNumberStartIdx) + insertion + result.slice(i)
                    }
                    currentNumber = ""
                    currentNumberStartIdx = null
                    nestingLevel--
                    break
                case ",":
                    if (finishedExplodes && currentNumber !== "" && parseInt(currentNumber, 10) >= 10) {
                        // split
                        reduceSum = true
                        let val = parseInt(currentNumber, 10)
                        let insertion = "[" + Math.floor(val / 2) + "," + Math.ceil(val / 2) + "]"
                        result = result.slice(0, currentNumberStartIdx) + insertion + result.slice(i)
                    }
                    currentNumber = ""
                    currentNumberStartIdx = null
                    break
                default:
                    if (currentNumberStartIdx === null)
                        currentNumberStartIdx = i
                    currentNumber += c
            }
            if (reduceSum)
                break
            if (i === result.length - 1 && !finishedExplodes) {
                finishedExplodes = true
                i = -1
            }
        }
    } while (reduceSum)
    return result
}