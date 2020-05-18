const harmonicSets = require('../harmonicSets')
const {
  formatterLy,
  transposeSet,
  convertDigitToNoteSet,
  convertNoteToDigit,
  convertHumanToLySyntax
} = require('../utils')

const triad = set => [set[0], set[2], set[4]]

const chord = (key, type) => {
  let scaleType = ''
  let data

  switch (type) {
    case 'maj-triad':
      scaleType = 'ionian'
      data = `<${formatterLy(
        convertDigitToNoteSet(
          triad(
            transposeSet(
              harmonicSets[scaleType],
              convertNoteToDigit(convertHumanToLySyntax(key))
            )
          )
        )
      )}>1`
      break
    case 'min-triad':
      scaleType = 'dorian'
      data = `<${formatterLy(
        convertDigitToNoteSet(
          triad(
            transposeSet(
              harmonicSets[scaleType],
              convertNoteToDigit(convertHumanToLySyntax(key))
            )
          )
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
