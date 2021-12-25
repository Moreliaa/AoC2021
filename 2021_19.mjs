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
    let currentScanners = []
    let nextScanners = []
    let seekAnchor = false
    let anchorPoint = null
    let threshold = 12
    let sPos = [[0, 0, 0]]
    while (handledIdx.length !== scanners.length) {
        if (currentScanners.length === 0) {
            seekAnchor = true
            if (anchorPoint === null) {
                currentScanners = scanners.map((v, idx) => idx).filter((idx) => handledIdx.indexOf(idx) === -1)
            } else {
                currentScanners = scanners.map((v, idx) => idx).filter((idx) => handledIdx.indexOf(idx) !== -1)
            }
        }
        if (seekAnchor && anchorPoint !== null) {
            threshold--
        } else {
            threshold = 12
        }
        handledIdx.sort((a, b) => a - b)
        console.log("nextscans", currentScanners, threshold, seekAnchor, anchorPoint, handledIdx.join(','))
        for (let i = 0; i < currentScanners.length; i++) {
            let matchFound = false
            let scanner = scanners[currentScanners[i]]
            for (let k = 0; k < scanners.length; k++) {
                if (currentScanners[i] === k || handledIdx.indexOf(k) !== -1)
                    continue
                let otherScanner = scanners[k]
                let permutations = rotations(otherScanner)
                for (let j = 0; j < permutations.length; j++) {
                    let matchingScanner = isMatch(scanner, permutations[j], threshold)
                    if (matchingScanner) {
                        console.log("Match: ", currentScanners[i], k, matchingScanner.diffsCoords)
                        scanners[k] = matchingScanner.s2New
                        sPos.push(matchingScanner.diffsCoords)
                        handledIdx.push(k)
                        nextScanners.push(k)
                        matchFound = true
                        break
                    }
                }
            }
            if (matchFound && seekAnchor) {
                if (anchorPoint === null) {
                    anchorPoint = currentScanners[i]
                    handledIdx.push(currentScanners[i])
                }

                seekAnchor = false
                break
            }
        }
        currentScanners = nextScanners
        nextScanners = []
    }
    handledIdx.sort((a, b) => a - b)
    console.log(handledIdx)

    let beacons = new Set()
    for (let s of scanners) {
        for (let b of s) {
            let key = b[0] + "," + b[1] + "," + b[2]
            if (!beacons.has(key))
                beacons.add(key)
        }
    }
    console.log("Pt1:", beacons.size)

    let distances = []
    for (let i = 0; i < sPos.length; i++) {
        for (let j = 0; j < sPos.length; j++) {
            if (i === j)
                continue
            distances.push(
                Math.abs(sPos[i][0] - sPos[j][0]) +
                Math.abs(sPos[i][1] - sPos[j][1]) +
                Math.abs(sPos[i][2] - sPos[j][2])
            )
        }
    }
    console.log("Pt2:", Math.max(...distances))
}

function isMatch(s1, s2, threshold) {
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
    let diffsOverThreshold = []
    for (let d in diffs) {
        if (diffs[d].length >= threshold)
            diffsOverThreshold.push([d, diffs[d]])
    }
    if (diffsOverThreshold.length === 0) {
        return false
    }

    let matches = []
    for (let d of diffsOverThreshold) {
        let result = true
        let diffsCoords = [parseInt(d[0], 10)]
        for (let coord = 1; coord <= 2; coord++) {
            let values = d[1].map(entry => s1[entry[0]][coord] - s2[entry[1]][coord])
            result = result && values.filter(v => v === values[0]).length === threshold
            diffsCoords.push(values[0])
        }
        if (result)
            matches.push(diffsCoords)
    }
    if (matches.length === 1) {
        let diffsCoords = matches[0]
        s2.sort(sortScanner)
        let s2New = s2.map(entry => [entry[0] + diffsCoords[0], entry[1] + diffsCoords[1], entry[2] + diffsCoords[2]])
        return { diffsCoords, s2New }
    } else if (matches.length > 1) {
        console.log("This is a problem.")
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
        // positive x
        rots[0].push([+coord[0], +coord[1], +coord[2]])
        rots[1].push([+coord[0], -coord[2], +coord[1]])
        rots[2].push([+coord[0], -coord[1], -coord[2]])
        rots[3].push([+coord[0], +coord[2], -coord[1]])
        // negative x
        rots[4].push([-coord[0], -coord[1], +coord[2]])
        rots[5].push([-coord[0], +coord[2], +coord[1]])
        rots[6].push([-coord[0], +coord[1], -coord[2]])
        rots[7].push([-coord[0], -coord[2], -coord[1]])
        // positive y
        rots[8].push([+coord[1], +coord[2], +coord[0]])
        rots[9].push([+coord[1], -coord[0], +coord[2]])
        rots[10].push([+coord[1], -coord[2], -coord[0]])
        rots[11].push([+coord[1], +coord[0], -coord[2]])
        // negative y
        rots[12].push([-coord[1], -coord[2], +coord[0]])
        rots[13].push([-coord[1], +coord[0], +coord[2]])
        rots[14].push([-coord[1], +coord[2], -coord[0]])
        rots[15].push([-coord[1], -coord[0], -coord[2]])
        // positive z
        rots[16].push([+coord[2], +coord[0], +coord[1]])
        rots[17].push([+coord[2], -coord[1], +coord[0]])
        rots[18].push([+coord[2], -coord[0], -coord[1]])
        rots[19].push([+coord[2], +coord[1], -coord[0]])
        // negative z
        rots[20].push([-coord[2], -coord[0], +coord[1]])
        rots[21].push([-coord[2], +coord[1], +coord[0]])
        rots[22].push([-coord[2], +coord[0], -coord[1]])
        rots[23].push([-coord[2], -coord[1], -coord[0]])
    }
    return rots
}