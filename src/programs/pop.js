import { readScore, writeScore } from '../utils/output-utils.js'

export const pop = () => {
  const read = readScore()
  if (read.one) {
    writeScore(read.one.slice(0, read.one.length - 1), true)
    console.log('Last measure removed.')
  } else {
    console.log('No score to output')
  }
}
