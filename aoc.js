const https = require("https")
const fs = require("fs-extra")

if (process.argv.length < 4) {
    console.error(`Usage: node aoc <year> <day>`)
    return
}

const cookie = fs.readFileSync('./cookie.txt')
getInput(process.argv[2], process.argv[3])


function getInput(year, day) {
    const inputPath = getInputPath(year, day);
    console.log(process.cwd(), inputPath)
    fs.readFile(inputPath, (err, data) => {
        if (err)
            fetchInput(year, day, inputPath)
        else
            runDay(year, day, data.toString())
    })
}

function getInputPath(year, day) {
    return `${process.cwd()}/input/${year}_${day}.txt`
}

function fetchInput(year, day, inputPath) {
    const path = `/${year}/day/${day}/input`
    const options = {
        host: 'adventofcode.com',
        path: path,
        method: 'GET',
        headers: {
            'Cookie': cookie
        }
    }

    let req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        let body = []
        res.on('data', (d) => {
            body.push(d)
        }).on('end', () => {
            let result = Buffer.concat(body).toString()
            fs.outputFile(inputPath, result).then(() => {
                runDay(year, day, result)
            }).catch(err => {
                console.error(err)
            })
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.end()
}

function runDay(year, day, input) {
    const scriptName = `./${year}_${day}.mjs`
    import(scriptName).then((module) => {
        module.solve(input)
    }).catch((e) => { console.error(e) })
}