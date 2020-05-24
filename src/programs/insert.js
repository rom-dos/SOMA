import { output, writeScore } from '../utils/output-utils.js'

export const insert = (input, options) => {
  if (options.add) {
    writeScore(input, false, options.add)
  } else {
    output(input)
  }
}
