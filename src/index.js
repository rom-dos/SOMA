#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const { timeStamp } = require('@rom-dos/timestamp')
const homedir = require('os').homedir()
const terminalImage = require('terminal-image')

const {
  chordLength,
  createScore,
  playScale,
  cellFold,
  sequence,
  randChordGen,
  formatterLy,
  printLilyPond,
  transposeSet,
  convertDigitToNoteSet,
  convertNoteToDigit,
  convertHumanToLySyntax,
  writeScore,
  readScore
} = require('./utils.js')
const { chord } = require('./programs/chord.js')
const { chordTypes } = require('./chordTypes.js')
const { scaleTypes } = require('./scaleTypes.js')

shell.mkdir('-p', `${homedir}/soma-output`)
shell.mkdir('-p', `${homedir}/.cache/soma`)

const cache = `${homedir}/.cache/soma`

const output = input => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'
  const outputDir = `${homedir}/soma-output`

  fs.writeFileSync(
    `${homedir}/soma-output/${time}.ly`,
    printLilyPond(input),
    err => {
      if (err) throw err
    }
  )

  shell.exec(`${lilypond} -fpng -fpdf ${outputDir}/${time}.ly`)
  shell.mv('*.pdf', '*.midi', '*.png', `${outputDir}/`)

  // return time
  shell.exec(
    `magick convert ${outputDir}/${time}.png -channel RGB -negate ${outputDir}/${time}-white.png`
  )
  ;(async () => {
    console.log(
      await terminalImage.file(`${outputDir}/${time}-white.png`, {
        width: '88%',
        height: '16%'
      })
    )
  })()
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
  .command('chord <key> <type>')
  .alias('ch')
  .description('Generate specified chord.')
  .option('-o, --octave <oct>', 'Shift the octave.', '')
  .option('-i --inversion <inv>', 'Invert chord.', '0')
  .option('-d, --duration <dur>', 'Apply duration to chord.', '1')
  .option('-a, --add', 'Add chord to score.')
  .action((key, type, options) => {
    if (options.inversion) {
      if (Number(options.inversion) > chordLength(type) - 1) {
        console.log(
          `${
            options.inversion
          } is greater than the amount of inversions possible for this chord, ${chordLength(
            type
          ) - 1}.`
        )
        return false
      }
    }
    if (options.add) {
      writeScore(
        chord(key, type, options.octave, options.inversion, options.duration)
      )
      // console.log(chord(key, type, options.octave))
    } else {
      output(
        chord(key, type, options.octave, options.inversion, options.duration)
      )
    }
  })

/* init (score)
 * -n, --name <score-name>
 *
 */
program
  .command('init')
  .alias('new')
  .description('Create new score in .json format.')
  .option('-n, --name <score-name>', 'Add custom name to score.', '')
  .action(options => {
    createScore(options.name)
  })

/* output (score)
 * -n, --name <score-name>
 *
 */
program
  .command('score')
  .alias('output')
  .description('Output score to console.')
  .option('-l, --length', 'Display score length (in measures).')
  .option('-m, --measure <m>', 'Output specified measure.')
  .action(options => {
    const read = readScore()
    if (read.one) {
      options.length
        ? console.log(`Score Duration: ${read.one.length} measures.`)
        : options.measure
        ? output(read.one[options.measure - 1])
        : output(read.one.join(' '))
    } else {
      console.log('No score to output')
    }
  })

/* pop
 * Remove last measure from score and place in cache.
 *
 */
program
  .command('pop')
  .description('Remove last measure from score and place in cache.')
  .action(() => {
    const read = readScore()
    if (read.one) {
      writeScore(read.one.slice(0, read.one.length - 1), true)
      console.log('Last measure removed.')
    } else {
      console.log('No score to output')
    }
  })

/* insert
 * Insert raw LilyPond markup
 *
 */
program
  .command('insert <input>')
  .alias('i')
  .description('Insert raw LilyPond markup.')
  .option('-a, --add', 'Add input to score.')
  .action((input, options) => {
    if (options.add) {
      writeScore(input)
    } else {
      output(input)
    }
  })

/* ls
 * List various information about the score
 *
 */
program
  .command('ls')
  .alias('list')
  .description('List various information.')
  .option('--chords', 'Display list of available chords.')
  .option('--scales', 'Display list of available scales.')
  .action(options => {
    if (options.chords) {
      console.log('')
      console.log('Available chords:')
      console.log('')
      chordTypes.map(x => console.log(x.name))
    }
    if (options.scales) {
      console.log('')
      console.log('Available scales:')
      console.log('')
      scaleTypes.map(x => console.log(x.name))
    }
  })

program.parse(process.argv)
