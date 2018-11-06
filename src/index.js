const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { playScale, printLilyPond } = require('./utils.js')
const { timeStamp } = require('@rom-dos/timestamp')
const program = require('commander')

const output = (input) => {
  const time = timeStamp()
  fs.writeFile(`../output/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err

    console.log('Success! Check the output directory')
  })
}

program
  .version('0.1.0')
  .description('System Of Musical Architecture')

program
  .command('printScale <type> <key>')
  .alias('ps')
  .description('Print scale(s)')
  .action((type, key) => {
    output(playScale(harmonicSets[type][key][1]))
  })

program.parse(process.argv)
