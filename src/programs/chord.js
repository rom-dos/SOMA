const harmonicSets = require('../harmonicSets')
const {
  triad,
  formatterLy,
  transposeSet,
  convertDigitToNoteSet,
  convertNoteToDigit,
  convertHumanToLySyntax,
  convertMovementToOctave,
  insertOctave,
  seventhChord
} = require('../utils')

const chord = (key, type, octave) => {
  let scaleType = ''
  let data

  switch (type) {
    case 'maj-triad':
      scaleType = 'ionian'
      data = `<${formatterLy(
        insertOctave(
          convertDigitToNoteSet(
            triad(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            )
          ),
          convertMovementToOctave(octave)
        )
      )}>1`
      break
    case 'min-triad':
      scaleType = 'dorian'
      data = `<${formatterLy(
        insertOctave(
          convertDigitToNoteSet(
            triad(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            )
          ),
          convertMovementToOctave(octave)
        )
      )}>1`
      break
    case 'maj-seventh':
      scaleType = 'ionian'
      data = `<${formatterLy(
        insertOctave(
          convertDigitToNoteSet(
            seventhChord(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            )
          ),
          convertMovementToOctave(octave)
        )
      )}>1`
      break
    case 'min-seventh':
      scaleType = 'dorian'
      data = `<${formatterLy(
        insertOctave(
          convertDigitToNoteSet(
            seventhChord(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            )
          ),
          convertMovementToOctave(octave)
        )
      )}>1`
      break
    default:
      break
  }

  return data
}

module.exports = {
  chord
}
