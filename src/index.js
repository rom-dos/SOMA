#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { timeStamp } = require('@rom-dos/timestamp')
const homedir = require('os').homedir()

const {
  quantSet,
  playScale,
  cellFold,
  sequence,
  randChordGen,
  formatterLy,
  printLilyPond
} = require('./utils.js')

shell.mkdir('-p', `${homedir}/soma-output`)

const output = (input) => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'

  fs.writeFileSync(`${homedir}/soma-output/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err
  })

  shell.exec(`${lilypond} ${homedir}/soma-output/${time}.ly`)
  shell.mv('*.pdf', '*.midi', `${homedir}/soma-output`)
  console.log('Success! Check the output directory')
}

program
  .version('0.0.6')
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

program
  .command('chordGen <type> <key> <count> <order> <num>')
  .alias('cg')
  .description('Generate chords within a given a key')
  .action((type, key, count, order, num) => {
    let i = 0
    let data = ''
    while (i < num) {
      data += formatterLy(randChordGen(harmonicSets[type][key][1], count, order), 'chord')
      data += `1 `
      i++
    }
    output(data)
  })

program.parse(process.argv)
