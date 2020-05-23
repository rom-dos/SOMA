import { harmonicSets } from '../harmonicSets.js'

/* eslint-disable */
String.prototype.regexIndexOf = function (regex, startpos) {
  let indexOf = this.substring(startpos || 0).search(regex)
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf
}
/* eslint-enable */

export const sequence = (seq, type, quant, tail) => {
  if (typeof seq === 'string') {
    seq = seq.split(' ')
  }

  let data = ''
  data += cellFold(
    playScale(convertDigitToNoteSet(harmonicSets[type]), quant),
    tail
  )

  seq.slice(1).forEach(x => {
    let newLine = cellFold(
      playScale(
        convertDigitToNoteSet(
          transposeSet(
            harmonicSets[type],
            convertNoteToDigit(convertHumanToLySyntax(x))
          )
        ),
        quant
      ),
      tail
    )

    newLine = newLine.split(' ')
    const firstNote = newLine[0]
    const splicePoint = firstNote.regexIndexOf(/[0-9]/, 0)
    newLine[0] =
      firstNote.slice(0, splicePoint) + ',' + firstNote.slice(splicePoint)
    newLine = newLine.join(' ')
    data += newLine
  })

  return data
}
