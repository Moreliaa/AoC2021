import Util from './util.mjs'

export function solve(input) {
    let lines = Util.splitLines(input)
    // cant stop in front of rooms
    // can only move from hallway into destination rooms *if* only correct amphipods are in that room
    // after stopping in hallway, can only move to move into destination room
    let hallway = '...........'.split('')
    let rooms = [{ idx: 0, i: 2, s: 'A', t: ['D', 'B'] },
    { idx: 1, i: 4, s: 'B', t: ['B', 'D'] },
    { idx: 2, i: 6, s: 'C', t: ['A', 'A'] },
    { idx: 3, i: 8, s: 'D', t: ['C', 'C'] }]

    rooms = [
    { idx: 0, i: 2, s: 'A', t: ['B', 'A'] },
    { idx: 1, i: 4, s: 'B', t: ['C', 'D'] },
    { idx: 2, i: 6, s: 'C', t: ['B', 'C'] },
    { idx: 3, i: 8, s: 'D', t: ['D', 'A'] }]

    printBoard(rooms, hallway)
    while (!isSolved(rooms)) {
        act(rooms, hallway)
    }

    console.log("Pt1:", energy)

}

function isSolved(rooms) {
    return rooms.reduce((acc, curr) => acc && curr.t[0] === curr.s && curr.t[1] === curr.s, true)
}

let energy = 0
const energy_cost = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
}

function act(rooms, hallway) {
    // if we can move to a destination room and there are no incorrect amphipods
    for (let i = 0; i < hallway.length; i++) {
        let tile = hallway[i]
        if (tile === '.')
            continue
        if (tryMoveIntoDestination(rooms, hallway, "hall", i))
            return
    }

    for (let i = 0; i < rooms.length; i++) {
        let r = rooms[i]
        for (let j = 0; j < r.t.length; j++) {
            let tile = r.t[j]
            if (tile === '.')
                continue
            if (tryMoveIntoDestination(rooms, hallway, "room", i))
                return
        }
    }
    // otherwise pick the cheapest to move amphipod inside a room, prioritizing making room for incorrect amphipods to move out 
    let next = null
    for (let j = 0; j < rooms[0].t.length; j++) {
        for (let i = 0; i < rooms.length; i++) {
            let r = rooms[i]
            let tile = r.t[j]
            if (tile === '.')
                continue
            if (j !== 0 && rooms[i].t[0] !== '.') // blocked
                continue
            let priority = r.t.reduce((acc, curr) => acc || (curr === '.' || curr === r.s), false) ? 0 : 1
            if (!next || rooms[next.roomIdx].t[next.tileIdx] > tile || priority > next.priority)
                next = { roomIdx: i, tileIdx: j, priority}
        }
    }
    // move next adjacent to target room depending on the movement intent of the contained top element
    tryMove(rooms,hallway,next)
}

function tryMove(rooms, hallway, next) {
    let targetRoom = rooms.filter(r => r.s === rooms[next.roomIdx].t[next.tileIdx])[0]
    let topElementInRoom = targetRoom.t[0] !== '.' && targetRoom !== rooms[next.roomIdx] ? targetRoom.t[0] : targetRoom.t[1]
    let targetRoomOfTopElement = rooms.filter(r => r.s === topElementInRoom)[0]
    let offset = targetRoom.i - targetRoomOfTopElement.i < 0 ? -1 : 1
    console.log("targets", targetRoom, targetRoomOfTopElement)
    let path = next.tileIdx > 0 ? [rooms[next.roomIdx].t[0]] : []
    if (rooms[next.roomIdx].i < targetRoom.i + offset)
        path = path.concat(hallway.slice(rooms[next.roomIdx].i, targetRoom.i + offset + 1))
    else
        path = path.concat(hallway.slice(targetRoom.i + offset, rooms[next.roomIdx].i + 1))
    console.log("path", path)
    if (path.filter(t => t === '.').length !== path.length) {
        // if the target tile is blocked, the blocking element can be pushed only if its one tile away from the edge of the hallway
        if (targetRoom.i === 2 && offset === -1 && hallway[0] === '.') {
            //push left and move there
            move(rooms, hallway, "hall", targetRoom.i + offset, "hall", targetRoom.i + offset - 1, 1)
        } else if (targetRoom.i === 8 && offset === 1 && hallway[hallway.length - 1] === '.') {
            // push rigth and move there
            move(rooms, hallway, "hall", targetRoom.i + offset, "hall", targetRoom.i + offset + 1, 1)
        } else {
            return false
        }
    }
    move(rooms, hallway, "room", next.roomIdx, "hall", targetRoom.i + offset, path.length)
    return true
}

function move(rooms, hallway, from, fromIdx, to, toIdx, steps) {
    let a
    let aIdx
    if (from === "room") {
        aIdx = (rooms[fromIdx].t[0] === '.') ? 1 : 0
        a = rooms[fromIdx].t[aIdx]
        rooms[fromIdx].t[aIdx] = '.'
    } else {
        a = hallway[fromIdx]
        hallway[fromIdx] = '.'
    }

    energy += steps * energy_cost[a]

    if (to === "room") {
        if (rooms[toIdx].t[1] === '.')
            rooms[toIdx].t[1] = a
        else
            rooms[toIdx].t[0] = a
    } else {
        hallway[toIdx] = a
    }

    printBoard(rooms, hallway)
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

function tryMoveIntoDestination(rooms, hallway, from, fromIdx) {
    let a
    let aIdx
    if (from === "room") {
        aIdx = (rooms[fromIdx].t[0] === '.') ? 1 : 0
        a = rooms[fromIdx].t[aIdx]
    } else {
        a = hallway[fromIdx]
    }
    let targetRoom = rooms.filter(r => r.s === a)[0]
    if (from === "room" && fromIdx === targetRoom.idx)
        return false
    let validElementsInRoom = targetRoom.t.filter(tile => tile === '.' || tile === targetRoom.s)
    if (validElementsInRoom.length !== 2)
        return false
    let path = []
    if (from === "room") {
        path = aIdx > 0 ? [rooms[fromIdx].t[0]] : []
        if (rooms[fromIdx].i < targetRoom.i)
            path = path.concat(hallway.slice(rooms[fromIdx].i, targetRoom.i + 1))
        else
            path = path.concat(hallway.slice(targetRoom.i, rooms[fromIdx].i + 1))
    } else {
        if (fromIdx < targetRoom.i)
            path = path.concat(hallway.slice(fromIdx + 1, targetRoom.i + 1))
        else
            path = path.concat(hallway.slice(targetRoom.i + 1, fromIdx + 1))
    }
    path = path.concat(targetRoom.t[1] !== '.' ? [targetRoom.t[0]] : targetRoom.t)
    if (path.filter(t => t === '.').length !== path.length) {
        return false
    }
    move(rooms, hallway, from, fromIdx, "room", targetRoom.idx, path.length)
    return true
}