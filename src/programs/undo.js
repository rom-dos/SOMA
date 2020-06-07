import fs from 'fs'
import { readRc, readScore, output } from '../utils/output-utils.js'
const cwd = process.cwd()

export const undo = () => {
  const score = readScore()
  const lastInsert = score.staveHistory[score.staveHistory.length - 1]

  if (lastInsert === 'dbl') {
    fs.writeFileSync(
      `${cwd}/score.json`,
      JSON.stringify(
        Object.assign({}, score, {
          a: score.a.slice(0, score.a.length - 1),
          b: score.b.slice(0, score.b.length - 1),
          staveHistory: score.staveHistory.slice(
            0,
            score.staveHistory.length - 1
          )
        })
      ),
      'utf8'
    )
  } else {
    fs.writeFileSync(
      `${cwd}/score.json`,
      JSON.stringify(
        Object.assign({}, score, {
          [lastInsert]: score[lastInsert].slice(
            0,
            score[lastInsert].length - 1
          ),
          staveHistory: score.staveHistory.slice(
            0,
            score.staveHistory.length - 1
          )
        })
      ),
      'utf8'
    )
  }
  console.log('Last insert removed from score. ')
  const update = readScore()
  console.table(update)

  /*


  */
  // const rc = readRc()
  // const score = readScore()
  // const staveCount = Number(rc['stave-count'])
  // const silent = options.silent ? true : false
  // if (options.length) {
  //   let scoreLength = 0
  //   if (staveCount === 1) {
  //     scoreLength = score.a.length
  //   } else {
  //     let longest = score.a.length
  //     for (const stave in score) {
  //       if (score[stave].length > longest) {
  //         longest = score[stave].length
  //       }
  //     }
  //     scoreLength = longest
  //   }
  //   console.log(
  //     `Score Duration: ${scoreLength} ${
  //       scoreLength > 1 || scoreLength === 0 ? 'measures' : 'measure'
  //     }.`
  //   )
  // } else {
  //   if (staveCount === 1) {
  //     output(score.a.join(' '), silent, options.width)
  //   } else if (staveCount > 1) {
  //     output(score, silent, options.width)
  //   } else {
  //     console.log('No score to output.')
  //   }
  // }
  // console.log('score')
  // console.log(score.a.length)
  // const read = readScore()
  // if (read.one) {
  //   options.length
  //     ? console.log(`Score Duration: ${read.one.length} measures.`)
  //     : options.measure
  //     ? output(read.one[options.measure - 1], read.outputDir)
  //     : output(read.one.join(' '), read.outputDir)
  // } else {
  //   console.log('No score to output')
  // }
}
