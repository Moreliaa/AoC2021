export default class Util {
    static splitLines (input, filterEmpty=true) {
        return input.split(/\n/).filter(i => !filterEmpty || i !== "")
    }
    static splitLinesInt (input) {
        return this.splitLines(input).map(i => parseInt(i, 10))
    }
}