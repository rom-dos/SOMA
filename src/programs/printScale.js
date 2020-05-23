import { harmonicSets } from '../harmonicSets.js'
import { cellFold, transposeSet } from '../utils/transform-utils.js'
import {
  convertDigitToNoteSet,
  convertHumanToLySyntax,
  convertNoteToDigit
} from '../utils/conversion-utils.js'
import { output } from '../utils/output-utils.js'
import { playScale } from '../utils/scale-utils.js'
import { sequence } from '../utils/sequencing-utils.js'

export const printScale = (type, key, quant, tail, mode) => {
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
}
