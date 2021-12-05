export default class Util {
    static splitLines (input, filterEmpty=true) {
        return input.split(/\n/).filter(i => !filterEmpty || i !== "")
    }
    static splitLinesInt (input) {
        return this.splitLines(input).map(i => parseInt(i, 10))
    }
    // maps
    static map_getKey(x, y) {
        return `${x},${y}`
    }
    static map_print (map, x_min, x_max, y_min, y_max) {
        for (let y = y_min; y <= y_max; y++) {
            let row = []
            for (let x = x_min; x <= x_max; x++) {
                let key = this.map_getKey(x,y)
                row.push(map.has(key) ? map.get(key) : ".")
            }
            console.log(row.join(''))
        }
    }
}