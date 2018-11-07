const program = require('commander')
const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { playScale, cellFold, printLilyPond } = require('./utils.js')
const { timeStamp } = require('@rom-dos/timestamp')

const output = (input) => {
  const time = timeStamp()
  fs.writeFile(`../output/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err

    console.log('Success! Check the output directory')
  })
}

program
  .version('0.0.4')
  .description('System Of Musical Architecture')

program
  .command('printScale <type> <key> <quant> <tail>')
  .alias('ps')
  .description('Print scale(s)')
  .action((type, key, quant, tail) => {
    output(cellFold(playScale(harmonicSets[type][key][1], quant), tail))
  })

program.parse(process.argv)
