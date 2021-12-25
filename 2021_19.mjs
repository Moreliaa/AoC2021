import Util from './util.mjs'

export function solve(input) {
    /*input =`--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14
`*/
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
    while (handledIdx.length !== scanners.length && !seekAnchor) {
        if (currentScanners.length === 0) {
            seekAnchor = true
            currentScanners = scanners.map((v, idx) => idx).filter((idx) => handledIdx.indexOf(idx) === -1)
        }
        console.log("nextscans", currentScanners)
        for (let i = 0; i < currentScanners.length; i++) {
            let matchFound = false
            let scanner = scanners[currentScanners[i]]
            for (let k = 0; k < scanners.length; k++) {
                if (currentScanners[i] === k || handledIdx.indexOf(k) !== -1)
                    continue
                let otherScanner = scanners[k]
                let permutations = rotations(otherScanner)
                for (let j = 0; j < permutations.length; j++) {
                    let matchingScanner = isMatch(scanner, permutations[j])
                    if (matchingScanner) {
                        console.log("Match: ", currentScanners[i], k, matchingScanner.diffsCoords)
                        scanners[k] = matchingScanner.s2New
                        handledIdx.push(k)
                        nextScanners.push(k)
                        matchFound = true
                        break
                    }
                }
            }
            if (matchFound && seekAnchor) {
                handledIdx.push(currentScanners[i])
                seekAnchor = false
                break
            }
        }
        currentScanners = nextScanners
        nextScanners = []
    }
    handledIdx.sort((a,b) => a-b)
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