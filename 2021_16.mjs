import Util from './util.mjs'

export function solve(input) {
    let transmission = Util.splitLines(input)[0]
    let bits = transmission.split('').map(c => {
        switch (c) {
            case "0": return "0000"
            case "1": return "0001"
            case "2": return "0010"
            case "3": return "0011"
            case "4": return "0100"
            case "5": return "0101"
            case "6": return "0110"
            case "7": return "0111"
            case "8": return "1000"
            case "9": return "1001"
            case "A": return "1010"
            case "B": return "1011"
            case "C": return "1100"
            case "D": return "1101"
            case "E": return "1110"
            case "F": return "1111"
        }
    }).join('')

    let packets = getPackets(bits, bits.length)
    console.log("Pt1:", versionSum)
    console.log("Pt2:", calculateValue(packets[0]))
    //printPackets(packets, 0)
}

function printPackets(packets, depth) {
    let prefix = ''
    while (prefix.length < depth)
        prefix += '='
    depth++
    for (let p of packets) {
        console.log(prefix + '>', p)
        if (p.subpackets)
            printPackets(p.subpackets, depth)
    }

}

let i = 0
let versionSum = 0
function getPackets(bits, end, packetLimit = null) {
    let packets = []
    while (i < end) {
        let packet = {}
        packet.version = convertBits(bits, i, i + 3)
        versionSum += packet.version
        i += 3
        packet.typeID = convertBits(bits, i, i + 3)
        i += 3

        switch (packet.typeID) {
            case 4: // literal value
                packet.value = []
                while (bits[i] === "1") {
                    packet.value.push(bits.substring(i + 1, i + 5))
                    i += 5
                }
                packet.value.push(bits.substring(i + 1, i + 5))
                i += 5
                packet.value = parseInt(packet.value.join(''), 2)
                break
            default: // operator
                let lengthTypeID = bits[i]
                i++
                if (lengthTypeID === '0') { // 15 bits - total length in bits of subpackets
                    let num = convertBits(bits, i, i + 15)
                    i += 15
                    packet.subpackets = getPackets(bits, i + num)
                } else { // 11 bits number of subpackets immediately contained
                    let num = convertBits(bits, i, i + 11)
                    i += 11
                    packet.subpackets = getPackets(bits, bits.length, num)
                }
                packet.value = calculateValue(packet)
        }
        if (packet.value === 0 || packet.value || packet.subpackets.length > 0)
            packets.push(packet)
        if (packetLimit && packets.length === packetLimit)
            break
    }
    return packets
}

function calculateValue(packet) {
    if (packet.value !== undefined)
        return packet.value
    switch (packet.typeID) {
        case 0: // sum
            return packet.subpackets.reduce((acc, curr) => acc + calculateValue(curr), 0)
        case 1: // product
            return packet.subpackets.reduce((acc, curr) => acc * calculateValue(curr), 1)
        case 2: // minimum
            return packet.subpackets.reduce((acc, curr) => Math.min(acc, calculateValue(curr)), calculateValue(packet.subpackets[0]))
        case 3: // maximum
            return packet.subpackets.reduce((acc, curr) => Math.max(acc, calculateValue(curr)), calculateValue(packet.subpackets[0]))
        case 5: // greater than
            return calculateValue(packet.subpackets[0]) > calculateValue(packet.subpackets[1]) ? 1 : 0
        case 6: // less than
            return calculateValue(packet.subpackets[0]) < calculateValue(packet.subpackets[1]) ? 1 : 0
        case 7: // equal to
            return calculateValue(packet.subpackets[0]) === calculateValue(packet.subpackets[1]) ? 1 : 0
    }
}

function convertBits(bits, start, end) {
    let number = parseInt(bits.substring(start, end), 2)
    return number
}