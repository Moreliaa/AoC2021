import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input, false)
    let scanners = []
    let scanner = []
    for (let l of lines) {
        if (l.indexOf("---") === 0)
            continue
        else if (l === "") {
            scanners.push(scanner)
            scanner = []
        }
        else
            scanner.push(l.split(',').map(n => parseInt(n, 10)))
    }

    let combinedScanner = scanners.splice(0, 1)
    for (let i = 0; i < scanners.length; i++) {
        let permutations = rotations(scanners[i])
        for (let j = 0; j < permutations.length; j++) {
            if (combinedScanner.reduce((acc, curr) => {return acc && isMatch(curr, permutations[j]) }, true)) {
                console.log("is Match")
                combinedScanner.push(permutations[j])
                scanners.splice(i, 1)
                i = -1
                break
            }
        }
    }

    //console.log(scanners)
    // scanner detects beacons max 1000 units away in a cube
    // relative distances
    // axes are random for each scanner, as well as their sign
}

function isMatch(s1, s2) {
    let count = 0
    let diffA = null
    let diffB = null
    let diffC = null
console.log(s1[0], s2[0])
    for (let i = 0; i < s1.length; i++) {
        let c1 = s1[i]
        let c2 = s2[i]
        if (i === 0) {
            diffA = c1[0] - c2[0]
            diffB = c1[1] - c2[1]
            diffC = c1[2] - c2[2]
        } else {
            console.log(c1, c2)
            if (c1[0] - c2[0] === diffA && c1[1] - c2[1] === diffB && c1[2] - c2[2] === diffC)
                count++
        }
        if (count >= 11)
            return true
    }
    console.log(count, diffA, diffB, diffC)
    return false
}

function rotations(scanner) {
    let rots = new Array(24)
    for (let i = 0; i <rots.length; i++)
        rots[i] = []
    for (let coord of scanner) {
        //positive x
        rots[0].push([+coord[0], +coord[1], +coord[2]])
        rots[1].push([+coord[0], -coord[2], +coord[1]])
        rots[2].push([+coord[0], -coord[1], -coord[2]])
        rots[3].push([+coord[0], +coord[2], -coord[1]])
        //negative x
        rots[4].push([-coord[0], -coord[1], +coord[2]])
        rots[5].push([-coord[0], +coord[2], +coord[1]])
        rots[6].push([-coord[0], +coord[1], -coord[2]])
        rots[7].push([-coord[0], -coord[2], -coord[1]])
        //positive y
        rots[8].push([+coord[1], +coord[2], +coord[0]])
        rots[9].push([+coord[1], -coord[0], +coord[2]])
        rots[10].push([+coord[1], -coord[2], -coord[0]])
        rots[11].push([+coord[1], +coord[0], -coord[2]])
        //negative y
        rots[12].push([-coord[1], -coord[2], +coord[0]])
        rots[13].push([-coord[1], +coord[0], +coord[2]])
        rots[14].push([-coord[1], +coord[2], -coord[0]])
        rots[15].push([-coord[1], -coord[0], -coord[2]])
        //positive z
        rots[16].push([+coord[2], +coord[0], +coord[1]])
        rots[17].push([+coord[2], -coord[1], +coord[0]])
        rots[18].push([+coord[2], -coord[0], -coord[1]])
        rots[19].push([+coord[2], +coord[1], -coord[0]])
        //negative z
        rots[20].push([-coord[2], -coord[0], +coord[1]])
        rots[21].push([-coord[2], +coord[1], +coord[0]])
        rots[22].push([-coord[2], +coord[0], -coord[1]])
        rots[23].push([-coord[2], -coord[1], -coord[0]])
    }
    return rots
}