#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { timeStamp } = require('@rom-dos/timestamp')
const homedir = require('os').homedir()

const { chord } = require('./programs/chord')

const {
  playScale,
  cellFold,
  sequence,
  randChordGen,
  formatterLy,
  printLilyPond,
  transposeSet,
  convertDigitToNoteSet,
  convertNoteToDigit,
  convertHumanToLySyntax
} = require('./utils.js')

shell.mkdir('-p', `${homedir}/soma-output`)

const output = input => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'

  fs.writeFileSync(
    `${homedir}/soma-output/${time}.ly`,
    printLilyPond(input),
    err => {
      if (err) throw err
    }
  )

  shell.exec(`${lilypond} ${homedir}/soma-output/${time}.ly`)
  shell.mv('*.pdf', '*.midi', `${homedir}/soma-output`)
  console.log('Success! Check the output directory')
}

program.version('0.0.6').description('System Of Musical Architecture')

/* printScale
 * <type> = type of scale
 * <key> = key of scale
 * <quant> = quantization of notes
 * <tail> = sets the 'tail' of the scale (`rest`, `fold`, or `turnup`)
 * <mode> = `normal` or `log`
 */
program
  .command('printScale <type> <key> <quant> <tail> <mode>')
  .alias('ps')
  .description('Print scale(s)')
  .action((type, key, quant, tail, mode) => {
    if (key.toLowerCase() === 'all') {
      const seq = [
        'c',
        'db',
        'd',
        'eb',
        'e',
        'f',
        'gb',
        'g',
        'ab',
        'a',
        'bb',
        'b'
      ]
      const data = sequence(seq, type, quant, tail)
      mode === 'log' ? console.log(data) : output(data)
    } else if (key.length > 2) {
      const seq = key.split(' ')
      const data = sequence(seq, type, quant, tail)
      mode === 'log' ? console.log(data) : output(data)
    } else {
      const data = cellFold(
        playScale(
          convertDigitToNoteSet(
            transposeSet(
              harmonicSets[type],
              convertNoteToDigit(convertHumanToLySyntax(key))
            )
          ),
          quant
        ),
        tail
      )

      mode === 'log' ? console.log(data) : output(data)
    }
  })

/* chordGen
 * <type> = type of scale
 * <key> = key of scale
 * <count> = number of notes per chord
 * <order> = `sort` or `unsort`
 * <num> = number of chords
 * <mode> = `normal` or `log`
 */
program
  .command('chordGen <type> <key> <count> <order> <num> <mode>')
  .alias('cg')
  .description('Generate chords within a given a key')
  .action((type, key, count, order, num, mode) => {
    let i = 0
    let data = ''
    while (i < num) {
      data += formatterLy(
        randChordGen(
          convertDigitToNoteSet(
            transposeSet(
              harmonicSets[type],
              convertNoteToDigit(convertHumanToLySyntax(key))
            )
          ),
          count,
          order
        ),
        'chord'
      )
      data += '1 '
      i++
    }

    mode === 'log'
      ? console.table(
          data
            .split('1 ')
            .map(x => x.concat(1))
            .slice(0, -1)
        )
      : output(data)
  })

/* chord
 * <type> = type of scale
 * <key> = key of scale
 */
program
  .command('chord <type> <key>')
  .alias('c')
  .description('Generate specified chord.')
  .action((type, key) => {
    output(chord(type, key))
  })

program.parse(process.argv)
