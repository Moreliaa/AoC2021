import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    //lines = ["be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe"]
    // 4 digits per display
    // wires randomly for each display, but the same WITHIN a display
    let pt1_total = 0
    let pt2_total = 0
    for (let l of lines) {
        let l_split = l.split(" ")
        let signals = l_split.slice(0, l_split.indexOf("|")).map(str => { let s = str.split('').sort(); return s.join('') })
        let outputs = l_split.slice(l_split.indexOf("|") + 1).map(str => { let s = str.split('').sort(); return s.join('') })
        pt1_total += pt1_counts(signals, outputs)
        pt2_total += pt2_counts(signals, outputs)
        //console.log(signals, outputs)
    }
    console.log("Pt1:", pt1_total)
    console.log("Pt2:", pt2_total)
}

function pt1_counts(signals, outputs) {
    let numToSig = new Map()
    let sigToNum = new Map()
    for (let s of signals) {
        // 0 - 6 segments
        // 2 - 5 segments
        // 3 - 5 segments
        // 5 - 5 segments
        // 6 - 6 segments
        // 9 - 6 segments
        if (s.length === 2) {
            numToSig.set(1, s)
            sigToNum.set(s, 1)
        }
        else if (s.length === 4) {
            numToSig.set(4, s)
            sigToNum.set(s, 4)
        }
        else if (s.length === 3) {
            numToSig.set(7, s)
            sigToNum.set(s, 7)
        }
        else if (s.length === 7) {
            numToSig.set(8, s)
            sigToNum.set(s, 8)
        }
    }
    return outputs.reduce((acc, curr) => sigToNum.has(curr) ? ++acc : acc, 0)
}

function pt2_counts(signals, outputs) {
    let numToSig = new Map()
    let sigToNum = new Map()
    for (let s of signals) {
        // 0 - 6 segments
        // 2 - 5 segments
        // 3 - 5 segments
        // 5 - 5 segments
        // 6 - 6 segments
        // 9 - 6 segments
        if (s.length === 2) {
            numToSig.set(1, s)
            sigToNum.set(s, 1)
        }
        else if (s.length === 4) {
            numToSig.set(4, s)
            sigToNum.set(s, 4)
        }
        else if (s.length === 3) {
            numToSig.set(7, s)
            sigToNum.set(s, 7)
        }
        else if (s.length === 7) {
            numToSig.set(8, s)
            sigToNum.set(s, 8)
        }
    }
    // a in: 0 2 3 5 6 7 8 9    -> NOT in 1 4
    // b in: 0 4 5 6 8 9        -> NOT in 1 2 3 7
    // c in: 0 1 2 3 4 7 8 9    -> NOT in 5 6
    // d in: 2 3 4 5 6 8 9      -> NOT in 0 1 7
    // e in: 0 2 6 8            -> NOT in 1 3 4 5 7 9
    // f in: 0 1 3 4 5 6 7 8 9  -> NOT in 2
    // g in: 0 2 3 5 6 8 9      -> NOT in 1 4 7
    // we can map by the amount of times the signals come up: f -> 9 times, b -> 6 times, e -> 4 times
    // ac -> 8 times, dg -> 7 times
    // distinguish a and c by checking which one is present in 1 (in 1 -> c)
    // distinguish d and g by checking which one is in 4 (in 4 -> d)
    let sigToCount = new Map()
    for (let s of signals) {
        for (let c of s.split('')) {
            if (!sigToCount.has(c))
                sigToCount.set(c, 1)
            else
                sigToCount.set(c, sigToCount.get(c) + 1)
        }
    }

    let segments = new Map()
    let ac = []
    let dg = []
    for (let i of sigToCount.keys()) {
        switch (sigToCount.get(i)) {
            case 6:
                segments.set(i, 'b')
                break
            case 9:
                segments.set(i, 'f')
                break
            case 4:
                segments.set(i, 'e')
                break
            case 8:
                ac.push(i)
                break
            case 7:
                dg.push(i)
                break
        }
    }

    let ac0isin1 =numToSig.get(1).split('').indexOf(ac[0]) !== -1
    segments.set(ac[0], ac0isin1 ? 'c' : 'a')
    segments.set(ac[1], ac0isin1 ? 'a' : 'c')

    let dg0isin4 =numToSig.get(4).split('').indexOf(dg[0]) !== -1
    segments.set(dg[0], dg0isin4 ? 'd' : 'g')
    segments.set(dg[1], dg0isin4 ? 'g' : 'd')

    const origSignalsForDigits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']
    let digits = []
    for (let o of outputs) {
        let orig = o.split('').map(s => segments.get(s))
        orig.sort()
        orig = orig.join('')
        digits.push(origSignalsForDigits.indexOf(orig))
    }
    return parseInt(digits.map(d => d.toString()).join(''), 10)
}