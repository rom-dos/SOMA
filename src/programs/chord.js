import { chordGen, chordLength } from '../utils/chord-utils.js'
import { output, readScore, writeScore } from '../utils/output-utils.js'

export const chord = (key, type, options) => {
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
      chordGen(key, type, options.octave, options.inversion, options.duration),
      false,
      options.add
    )
  } else {
    output(
      chordGen(key, type, options.octave, options.inversion, options.duration)
    )
  }
}
