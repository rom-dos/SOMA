#!/usr/bin/env node

import program from 'commander'
import shell from 'shelljs'
import { homedir } from 'os'

import { chord } from './programs/chord.js'
import { chordGen } from './programs/chordGen.js'
import { ls } from './programs/ls.js'
import { insert } from './programs/insert.js'
import { pop } from './programs/pop.js'
import { score } from './programs/score.js'
import { init } from './programs/init.js'
import { printScale } from './programs/printScale.js'

shell.mkdir('-p', `${homedir}/soma-output`)
shell.mkdir('-p', `${homedir}/.cache/soma`)

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
 */
program
  .command('chord <key> <type>')
  .alias('ch')
  .description('Generate specified chord.')
  .option('-o, --octave <oct>', 'Shift the octave.', '')
  .option('-i --inversion <inv>', 'Invert chord.', '0')
  .option('-d, --duration <dur>', 'Apply duration to chord.', '1')
  .option('-a, --add', 'Add chord to score.')
  .action((key, type, options) => chord(key, type, options))

/* init (score)
 * -n, --name <score-name>
 *
 */
program
  .command('init')
  .alias('new')
  .description('Create new score in .json format.')
  .option('-n, --name <score-name>', 'Add custom name to score.', '')
  .action(options => init(options.name))

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
  .action(options => score(options))

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
  .option('-a, --add', 'Add input to score.')
  .action((input, options) => insert(input, options))

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

program.parse(process.argv)
