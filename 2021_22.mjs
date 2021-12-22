import Util from './util.mjs'

export function solve(input) {
    input = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`
/*
    input = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`*/
    let lines = Util.splitLines(input)
    let rx = new RegExp(/(.+) x=(.+)\.\.(.+),y=(.+)\.\.(.+),z=(.+)\.\.(.+)/)
    let commands = lines.map(l => {
        let m = l.match(rx)
        return {
            op: m[1],
            dim: {
                xMin: parseInt(m[2], 10), xMax: parseInt(m[3], 10),
                yMin: parseInt(m[4], 10), yMax: parseInt(m[5], 10),
                zMin: parseInt(m[6], 10), zMax: parseInt(m[7], 10)
            }
        }
    })

    let pt1 = 0;
    let cubes = []
    let steps = 0
    for (let command of commands) {
        console.log(command)
        steps++
        if (pt1 === 0 && Math.abs(command.dim.xMin) > 50)
            pt1 = onCubes(cubes)
        cubes = step(cubes, command)
        console.log(steps, onCubes(cubes))
    }

    console.log("Pt1:", pt1)
    console.log("Pt2:", onCubes(cubes))
}

function onCubes(cubes) {
    return cubes.reduce((acc, c) => acc + Math.abs((1 + c.xMax - c.xMin) * (1 + c.yMax - c.yMin) * (1 + c.zMax - c.zMin)), 0)
}

function step(cubes, command) {
    let newCubes = []
    let commandCubes = [command.dim]
    for (let c of cubes) {
        if (isIntersection(c, command.dim)) {
            if (command.op === 'on') {
                newCubes.push(c)
                commandCubes = splitCubes(commandCubes, c)
            } else {
                newCubes = newCubes.concat(splitCubes([c], command.dim))
            }
        } else {
            newCubes.push(c)
        }
    }
    if (command.op === 'on')
        newCubes = newCubes.concat(commandCubes)
    return newCubes
}

function isIntersection(cube1, cube2) {
    return checkAxis(cube1.xMin, cube1.xMax, cube2.xMin, cube2.xMax) &&
        checkAxis(cube1.yMin, cube1.yMax, cube2.yMin, cube2.yMax) &&
        checkAxis(cube1.zMin, cube1.zMax, cube2.zMin, cube2.zMax)
}

function checkAxis(min1, max1, min2, max2) {
    return (min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1)
}

function splitCubes(cubesToSplit, intersectingCube) {
    let newCubes = []
    console.log("splitentry", cubesToSplit, intersectingCube)
    console.log("on1", onCubes(cubesToSplit))
    for (let c of cubesToSplit) {
        if (!isIntersection(c, intersectingCube))
            newCubes.push(c)
        else {
            newCubes = newCubes.concat(split(c, intersectingCube))
        }
    }
    console.log("on2", onCubes(newCubes))
    console.log("Split result", newCubes)
    return newCubes
}

function split(c, intersectingCube) {
    // remove intersecting area from c
    let newCubes = []
    for (let axis of ['x', 'y', 'z']) {
        newCubes = newCubes.concat(splitAxis(axis, c, intersectingCube))
        //console.log("2", c)
    }
    return newCubes
}

function splitAxis(axis, c, intersectingCube) {
    let newCubes = []
    let minKey = axis + 'Min'
    let maxKey = axis + 'Max'
    if (c[minKey] < intersectingCube[minKey]) {
        let newCube = {}
        newCube[minKey] = c[minKey]
        newCube[maxKey] = intersectingCube[minKey] - 1
        for (let a of ['x', 'y', 'z']) {
            if (a !== axis) {
                newCube[a + 'Min'] = c[a + 'Min']
                newCube[a + 'Max'] = c[a + 'Max']
            }
        }
        newCubes.push(newCube)
        c[minKey] = Math.min(intersectingCube[minKey], c[maxKey])
    }

    if (c[maxKey] > intersectingCube[maxKey]) {
        let newCube = {}
        newCube[minKey] = intersectingCube[maxKey] +1
        newCube[maxKey] = c[maxKey]
        for (let a of ['x', 'y', 'z']) {
            if (a !== axis) {
                newCube[a + 'Min'] = c[a + 'Min']
                newCube[a + 'Max'] = c[a + 'Max']
            }
        }
        newCubes.push(newCube)
        c[maxKey] = Math.max(intersectingCube[maxKey], c[minKey])
    }
    return newCubes
}