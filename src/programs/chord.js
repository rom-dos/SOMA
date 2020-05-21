const harmonicSets = require('../harmonicSets')
const {
  triad,
  dimSeventhChord,
  formatterLy,
  transposeSet,
  convertDigitToNoteSet,
  convertNoteToDigit,
  convertHumanToLySyntax,
  convertMovementToOctave,
  insertOctave,
  inversion,
  seventhChord
} = require('../utils')

const chord = (key, type, octave, inv) => {
  let scaleType = ''
  let data

  switch (type) {
    case 'maj-triad':
    case 'maj-seventh':
      scaleType = 'ionian'
      break
    case 'min-triad':
    case 'min-seventh':
      scaleType = 'dorian'
      break
    case 'dom-seventh':
      scaleType = 'mixolydian'
      break
    case 'half-dim':
      scaleType = 'locrian'
      break
    case 'dim-seventh':
      scaleType = 'harmonicMinor'
      break
    default:
      break
  }

  if (type === 'maj-triad' || type === 'min-triad') {
    data = `<${formatterLy(
      insertOctave(
        convertDigitToNoteSet(
          inversion(
            triad(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            ),
            inv
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>1`
  } else if (type === 'dim-seventh') {
    data = `<${formatterLy(
      insertOctave(
        convertDigitToNoteSet(
          inversion(
            dimSeventhChord(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key)) + 1
              )
            ),
            inv
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>1`
  } else {
    data = `<${formatterLy(
      insertOctave(
        convertDigitToNoteSet(
          inversion(
            seventhChord(
              transposeSet(
                harmonicSets[scaleType],
                convertNoteToDigit(convertHumanToLySyntax(key))
              )
            ),
            inv
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>1`
  }

  return data
}

module.exports = {
  chord
}
