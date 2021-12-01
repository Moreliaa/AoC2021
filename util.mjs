export default class Util {
    static splitLinesInt (input) {
        return input.split(/\n/).map(i => parseInt(i, 10)).filter(i => !isNaN(i))
    }
}