import {
  convertDigitToNoteSet,
  convertHumanToLySyntax,
  convertNoteToDigit
} from '../utils/conversion-utils.js'
import { formatterLy, transposeSet } from '../utils/transform-utils.js'
import { randChordGen } from '../utils/chord-utils.js'
import { output } from '../utils/output-utils.js'

export const chordGen = (type, key, count, order, num, mode) => {
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
}
