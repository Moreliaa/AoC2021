export function solve(input) {
    let rooms_pt1 = [
        { idx: 0, i: 2, s: 'A', t: ['D', 'B'] },
        { idx: 1, i: 4, s: 'B', t: ['B', 'D'] },
        { idx: 2, i: 6, s: 'C', t: ['A', 'A'] },
        { idx: 3, i: 8, s: 'D', t: ['C', 'C'] }
    ]

    let rooms_pt2 = [
        { idx: 0, i: 2, s: 'A', t: ['D', 'D', 'D', 'B'] },
        { idx: 1, i: 4, s: 'B', t: ['B', 'C', 'B', 'D'] },
        { idx: 2, i: 6, s: 'C', t: ['A', 'B', 'A', 'A'] },
        { idx: 3, i: 8, s: 'D', t: ['C', 'A', 'C', 'C'] }
    ]

    console.log("Pt1:", solvePart(rooms_pt1))
    cache = new Map()
    console.log("Pt2:", solvePart(rooms_pt2))
}

let cache = new Map()
const energy_cost = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
}

function solvePart(rooms) {
    let hallway = '...........'.split('')
    let states = [[rooms, hallway, 0]]
    let nextStates = states
    let energies = []
    while (nextStates.length > 0) {
        console.log(nextStates.length)
        states = nextStates
        nextStates = []
        for (let s of states) {
            nextStates = nextStates.concat(step(s[0], s[1], s[2]))
        }
        for (let s of nextStates) {
            if (isSolved(s[0]))
                energies.push(s[2])
        }
    }
    return Math.min(...energies)
}

function step(rooms, hallway, energy) {
    let cacheKey = getCacheKey(rooms, hallway)
    if (cache.has(cacheKey) && cache.get(cacheKey) <= energy)
        return []
    cache.set(cacheKey, energy)
    let actors = possibleActors(rooms, hallway)
    let nextStates = []
    for (let a of actors[0]) { // hallway
        nextStates = nextStates.concat(tryMoveIntoDestination(rooms, hallway, a, energy))
    }
    for (let a of actors[1]) { // rooms
        nextStates = nextStates.concat(tryMoveIntoHallway(rooms, hallway, a, energy))
    }
    return nextStates
}

function possibleActors(rooms, hallway) {
    let a_hall = hallway.map((val, idx) => val !== '.' ? idx : null).filter(val => val !== null)
    let a_rooms = rooms.map((val, idx) => val.t.filter(tile => tile !== '.').length > 0 ? idx : null).filter(val => val !== null)
    return [a_hall, a_rooms]
}

function isSolved(rooms) {
    return rooms.reduce((acc, curr) => acc && curr.t[0] === curr.s && curr.t[1] === curr.s, true)
}

function getCacheKey(rooms, hallway) {
    let str = hallway.join('')
    for (let r of rooms) {
        str += r.t.join('')
    }
    return str
}

function move(rooms, hallway, from, fromIdx, to, toIdx, steps, energy) {
    let newRooms = rooms.map(r => { return { idx: r.idx, i: r.i, s: r.s, t: r.t.slice() } })
    let newHallway = hallway.slice()
    let a
    let aIdx
    if (from === "room") {
        aIdx = newRooms[fromIdx].t.map((val, idx) => val !== '.' ? idx : null).filter(val => val !== null)[0]
        a = newRooms[fromIdx].t[aIdx]
        newRooms[fromIdx].t[aIdx] = '.'
    } else {
        a = newHallway[fromIdx]
        newHallway[fromIdx] = '.'
    }

    let newEnergy = energy + steps * energy_cost[a]

    if (to === "room") {
        let targetIdx = newRooms[toIdx].t.map((val, idx) => val === '.' ? idx : null).filter(val => val !== null)
        targetIdx = targetIdx[targetIdx.length - 1]
        newRooms[toIdx].t[targetIdx] = a
    } else {
        newHallway[toIdx] = a
    }
    //printBoard(newRooms, newHallway)
    return [newRooms, newHallway, newEnergy]


}

function printBoard(rooms, hallway) {
    console.log(hallway.join(''))
    for (let j = 0; j < rooms[0].t.length; j++) {
        let line = ""

        for (let i = 0; i < hallway.length; i++) {
            let room = rooms.filter(r => r.i === i)[0]
            line += room ? room.t[j] : '#'
        }
        console.log(line)
    }
    console.log("")
}

function tryMoveIntoDestination(rooms, hallway, fromIdx, energy) {
    let a = hallway[fromIdx]
    let targetRoom = rooms.filter(r => r.s === a)[0]
    let validElementsInRoom = targetRoom.t.filter(tile => tile === '.' || tile === targetRoom.s)
    if (validElementsInRoom.length !== rooms[0].t.length)
        return []
    let path = []

    if (fromIdx < targetRoom.i)
        path = path.concat(hallway.slice(fromIdx + 1, targetRoom.i + 1))
    else
        path = path.concat(hallway.slice(targetRoom.i, fromIdx))

    path = path.concat(targetRoom.t.filter(tile => tile === '.'))
    if (path.filter(t => t === '.').length !== path.length) {
        return []
    }
    return [move(rooms, hallway, "hall", fromIdx, "room", targetRoom.idx, path.length, energy)]
}

function tryMoveIntoHallway(rooms, hallway, fromIdx, energy) {
    let currentRoom = rooms[fromIdx]
    if (currentRoom.t.filter(tile => tile === '.' || tile === currentRoom.s).length === currentRoom.t.length)
        return []
    let minIdx = currentRoom.i
    let maxIdx = currentRoom.i
    while (hallway[minIdx - 1] === '.' && minIdx > 0) {
        minIdx--
    }
    while (hallway[maxIdx + 1] === '.' && maxIdx < hallway.length) {
        maxIdx++
    }
    let result = []
    let distanceOutOfRoom = currentRoom.t.filter(tile => tile === '.').length
    for (let i = minIdx; i <= maxIdx; i++) {
        if (rooms.filter(r => r.i === i).length === 0) {
            let pathLength = Math.abs(currentRoom.i - i) + 1 + distanceOutOfRoom
            result.push(move(rooms, hallway, "room", fromIdx, "hall", i, pathLength, energy))
        }
    }
    return result
}