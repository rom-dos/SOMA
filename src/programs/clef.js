import { output, writeScore } from '../utils/output-utils.js'

export const clef = (type, options) => {
  if (options.add) {
    writeScore(`\\clef ${type}`, false, options.add)
  } else {
    output(`\\clef ${type}`)
  }
}
