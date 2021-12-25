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
    for (let s of scanners)
        s.sort(sortScanner)
    let handledIdx = []
    for (let i = 0; i < scanners.length; i++) {
        if (handledIdx.indexOf(i) === -1 && handledIdx.length !== 0)
            continue
        let scanner = scanners[i]
        for (let k = 0; k < scanners.length; k++) {
            if (k === i || handledIdx.indexOf(k) !== -1)
                continue
            let otherScanner = scanners[k]
            let permutations = rotations(otherScanner)
            for (let j = 0; j < permutations.length; j++) {
                let matchingScanner = isMatch(scanner, permutations[j])
                if (matchingScanner) {
                    console.log("Match: ", i, k, matchingScanner.diffsCoords)
                    scanners[k] = matchingScanner.s2New
                    if (handledIdx.length === 0) {
                        handledIdx.push(i)
                        i = -1
                    }
                    handledIdx.push(k)
                    break
                }
            }
        }
    }

    let beacons = new Set()
    for (let s of scanners) {
        for (let b of s) {
            let key = b[0] + "," + b[1] + "," + b[2]
            if (!beacons.has(key))
                beacons.add(key)
        }
    }
    console.log("Pt1:", beacons.size)

    //console.log(scanners)
    // scanner detects beacons max 1000 units away in a cube
    // relative distances
    // axes are random for each scanner, as well as their sign
}

function isMatch(s1, s2) {
    let diffs = {}
    let coord = 0
    for (let i = 0; i < s1.length; i++) {
        for (let j = 0; j < s2.length; j++) {
            let result = s1[i][coord] - s2[j][coord]
            if (!diffs[result])
                diffs[result] = [[i, j]]
            else
                diffs[result].push([i, j])
        }
    }
    let diffsOver12 = []
    for (let d in diffs) {
        if (diffs[d].length >= 12)
            diffsOver12.push([d, diffs[d]])
    }
    if (diffsOver12.length === 0) {
        return false
    }

    let matches = []
    for (let d of diffsOver12) {
        let result = true
        let diffsCoords = [parseInt(d[0], 10)]
        for (let coord = 1; coord <= 2; coord++) {
            let values = d[1].map(entry => s1[entry[0]][coord] - s2[entry[1]][coord])
            result = result && values.filter(v => v === values[0]).length === values.length
            diffsCoords.push(values[0])
        }
        if (result)
            matches.push(diffsCoords)
    }
    if (matches.length === 1) {
        let diffsCoords = matches[0]
        s2.sort(sortScanner)
        let s2New = s2.map(entry => [entry[0] + diffsCoords[0], entry[1] + diffsCoords[1], entry[2] + diffsCoords[2]])
        //console.log("s1, s2New", s1, s2New)
        return { diffsCoords, s2New }
    } else if (matches.length > 1) {
        console.log("big thonk")
        return false
    }
    return false
}

function sortScanner(a, b) {
    return a[0] - b[0]
}

function rotations(scanner) {
    let rots = new Array(24)
    for (let i = 0; i < rots.length; i++)
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