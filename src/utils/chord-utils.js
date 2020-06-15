import { harmonicSets } from '../harmonicSets.js'
import {
  convertDigitToNoteSet,
  convertDigitToNoteSetChord,
  convertHumanToLySyntax,
  convertNoteToDigit
} from './conversion-utils.js'
import {
  convertMovementToOctave,
  dropNote,
  formatterLy,
  insertOctave,
  inversion,
  transposeSet
} from './transform-utils.js'

export const chordGen = (key, type, octave, inv, duration, dn) => {
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
        convertDigitToNoteSetChord(
          dropNote(
            inversion(
              triad(
                transposeSet(
                  harmonicSets[scaleType],
                  convertNoteToDigit(convertHumanToLySyntax(key))
                )
              ),
              inv
            ),
            dn
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>${duration}`
  } else if (type === 'dim-seventh') {
    data = `<${formatterLy(
      insertOctave(
        convertDigitToNoteSetChord(
          dropNote(
            inversion(
              dimSeventhChord(
                transposeSet(
                  harmonicSets[scaleType],
                  convertNoteToDigit(convertHumanToLySyntax(key)) + 1
                )
              ),
              inv
            ),
            dn
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>${duration}`
  } else {
    data = `<${formatterLy(
      insertOctave(
        convertDigitToNoteSetChord(
          dropNote(
            inversion(
              seventhChord(
                transposeSet(
                  harmonicSets[scaleType],
                  convertNoteToDigit(convertHumanToLySyntax(key))
                )
              ),
              inv
            ),
            dn
          )
        ),
        convertMovementToOctave(octave)
      )
    )}>${duration}`
  }

  return data
}

export const chordLength = type => {
  switch (type) {
    case 'maj-triad':
    case 'min-triad':
      return 3
      break
    case 'maj-seventh':
    case 'min-seventh':
    case 'dom-seventh':
    case 'half-dim':
    case 'dim-seventh':
      return 4
      break
    default:
      break
  }
}

export const triad = set => [set[0], set[2], set[4]]

export const seventhChord = set => [set[0], set[2], set[4], set[6]]

export const dimSeventhChord = set => [set[6], set[1], set[3], set[5]]

export const randChordGen = (arr, count, order) => {
  let finalChord = []

  const randNote = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  while (finalChord.length < count) {
    const newNote = randNote(arr)
    if (finalChord.includes(newNote) === false) {
      finalChord.push(newNote)
    }
  }
  if (order === 'sort') {
    finalChord = finalChord.sort((a, b) => a > b)
    return finalChord
  } else {
    return finalChord
  }
}
