#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { playScale, cellFold, sequence, printLilyPond } = require('./utils.js')
const { timeStamp } = require('@rom-dos/timestamp')

const homedir = require('os').homedir()
shell.mkdir('-p', `${homedir}/soma-output`)

const output = (input) => {
  const time = timeStamp()
  // const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'
  fs.writeFile(`${homedir}/soma-output/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err

    console.log('Success! Check the output directory')
  })
  // shell.exec(`${lilypond} ${homedir}/soma-output/${time}.ly`)
}

program
  .version('0.0.4')
  .description('System Of Musical Architecture')

program
  .command('printScale <sType> <key> <quant> <tail>')
  .alias('ps')
  .description('Print scale(s)')
  .action((type, key, quant, tail) => {
    if (key.toLowerCase() === 'all') {
      const seq = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
      output(sequence(seq, type, quant, tail))
    } else if (key.length > 2) {
      const seq = key.split(' ')
      output(sequence(seq, type, quant, tail))
    } else {
      output(cellFold(playScale(harmonicSets[type][key][1], quant), tail))
    }
  })

program.parse(process.argv)
