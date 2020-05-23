import { readScore, output } from '../utils/output-utils.js'

export const score = options => {
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
}
