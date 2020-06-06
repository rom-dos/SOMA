#!/usr/bin/env node

import program from 'commander'
import shell from 'shelljs'
import { homedir } from 'os'

import { chord } from './programs/chord.js'
import { chordGen } from './programs/chordGen.js'
import { ls } from './programs/ls.js'
import { insert } from './programs/insert.js'
import { pop } from './programs/pop.js'
import { print } from './programs/print.js'
import { init } from './programs/init.js'
import { printScale } from './programs/printScale.js'

shell.mkdir('-p', `${homedir}/.cache/soma`)

program.version('0.0.6').description('System Of Musical Architecture')

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
  .action(options => ls(options))

/* init
 * -n, --name <score-name>
 * --description <score-description>
 * --staves <stave-count>
 * -t, --tempo <temp>
 */
program
  .command('init')
  .alias('new')
  .description('Create new score in .json format.')
  .option('-n, --name <score-name>', 'Add custom name to score.', '')
  .option('--description <score-description>', 'Add description to score.', '')
  .option('--staves <stave-count>', 'Define number of staves.', '1')
  .option('-t, --tempo <temp>', "Defines the score's tempo.", '130')
  .action(options => init(options))

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
  .action((type, key, quant, tail, mode) =>
    printScale(type, key, quant, tail, mode)
  )

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
  .action((type, key, count, order, num, mode) =>
    chordGen(type, key, count, order, num, mode)
  )

/* chord
 * <type> = type of scale
 * <key> = key of scale
 * -o, --octave <oct>
 * -i, --inversion <inv>
 * -d, --duration <dur>
 * -a, -add <stave>
 */
program
  .command('chord <key> <type>')
  .alias('ch')
  .description('Generate specified chord.')
  .option('-o, --octave <oct>', 'Shift the octave.', '')
  .option('-i --inversion <inv>', 'Invert chord.', '0')
  .option('-d, --duration <dur>', 'Apply duration to chord.', '1')
  .option('-a, --add <stave>', 'Add chord to specified stave.')
  .action((key, type, options) => chord(key, type, options))

/* print
 * -n, --name <score-name>
 *
 */
program
  .command('print')
  .alias('p')
  .description('Print score to console.')
  .option('-l, --length', 'Display score length (in measures).')
  .option('-m, --measure <m>', 'Output specified measure.')
  .option('-w, --width <w>', 'Set the width of the output score.', 88)
  .action(options => print(options))

/* pop
 * Remove last measure from score and place in cache.
 *
 */
program
  .command('pop')
  .description('Remove last measure from score and place in cache.')
  .action(() => pop())

/* insert
 * Insert raw LilyPond markup
 *
 */
program
  .command('insert <input>')
  .alias('i')
  .description('Insert raw LilyPond markup.')
  .option('-a, --add <stave>', 'Add input to score.')
  .action((input, options) => insert(input, options))

program.parse(process.argv)
