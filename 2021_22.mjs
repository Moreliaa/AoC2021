import Util from './util.mjs'

export function solve(input) {
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
    for (let command of commands) {
        if (pt1 === 0 && Math.abs(command.dim.xMin) > 50)
            pt1 = onCubes(cubes)
        cubes = step(cubes, command)
    }

    console.log("Pt1:", pt1)
    console.log("Pt2:", onCubes(cubes))
}

function onCubes(cubes) {
    return cubes.reduce((acc, c) => acc + Math.abs((1 + c.xMax - c.xMin) * (1 + c.yMax - c.yMin) * (1 + c.zMax - c.zMin)), 0)
}

function step(cubes, command) {
    let newCubes = []
    for (let c of cubes) {
        if (isIntersection(c, command.dim)) {
            newCubes = newCubes.concat(split(c, command.dim))
        } else {
            newCubes.push(c)
        }
    }
    if (command.op === 'on')
        newCubes.push(command.dim)
    return newCubes
}

function isIntersection(cube1, cube2) {
    return checkAxis(cube1.xMin, cube1.xMax, cube2.xMin, cube2.xMax) &&
        checkAxis(cube1.yMin, cube1.yMax, cube2.yMin, cube2.yMax) &&
        checkAxis(cube1.zMin, cube1.zMax, cube2.zMin, cube2.zMax)
}

function checkAxis(min1, max1, min2, max2) {
    return (min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1) ||
        (min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2)
}

function split(c, intersectingCube) {
    // remove intersecting area from c
    let newCubes = []
    for (let axis of ['x', 'y', 'z'])
        newCubes = newCubes.concat(splitAxis(axis, c, intersectingCube))
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
        newCube[minKey] = intersectingCube[maxKey] + 1
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