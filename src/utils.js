const harmonicSets = require('./harmonicSets')

/* eslint-disable */
String.prototype.regexIndexOf = function (regex, startpos) {
  let indexOf = this.substring(startpos || 0).search(regex)
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf
}
/* eslint-enable */

// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
const quantSet = (set, quant = 4) => [
  set.slice(0, 1)[0].concat(quant),
  ...set.slice(1)
]

const playScale = (set, quant = 4) => quantSet(set, quant).join(' ')

const cellFold = (str, type) => {
  switch (type.toLowerCase()) {
    case 'rest':
    case 'r':
      return `${str} r `
    case 'fold': {
      const arr = str.split(' ')
      arr.push(arr[arr.length - 2])
      return `${arr.join(' ')} `
    }
    case 'turnup':
      return `${str} ${str.match(/[a-z]+/i)} `
  }
}

const digitToNote = {
  0: 'c',
  1: 'des',
  2: 'd',
  3: 'ees',
  4: 'e',
  5: 'f',
  6: 'ges',
  7: 'g',
  8: 'aes',
  9: 'a',
  10: 'bes',
  11: 'b'
}

const convertDigitToNoteSet = set => set.map(x => digitToNote[x])

const noteToDigit = {
  c: 0,
  des: 1,
  d: 2,
  ees: 3,
  e: 4,
  f: 5,
  ges: 6,
  g: 7,
  aes: 8,
  a: 9,
  bes: 10,
  b: 11
}

const convertNoteToDigit = note => noteToDigit[note]

const humanToLy = {
  c: 'c',
  db: 'des',
  d: 'd',
  eb: 'ees',
  e: 'e',
  f: 'f',
  gb: 'ges',
  g: 'g',
  ab: 'aes',
  a: 'a',
  bb: 'bes',
  b: 'b'
}

const convertHumanToLySyntax = note => humanToLy[note.toLowerCase()]

const sequence = (seq, type, quant, tail) => {
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

const randChordGen = (arr, count, order) => {
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

const formatterLy = (set, type = 'default') => {
  let formattedSet
  if (typeof set === 'string') {
    formattedSet = set
  } else {
    formattedSet = set.join(' ')
  }
  type = type.toLowerCase()
  if (type === 'chord') {
    formattedSet = '<' + formattedSet + '>'
  }
  return formattedSet
}

const printLilyPond = (music, time) => {
  const txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4

      ${music} 
  }

  \\score {
    \\new PianoStaff
    <<
      \\new Staff = "upper" \\upper
    >>
    \\layout { }
    \\midi { }
    \\include "lilypond-book-preamble.ly"
  }
  \\paper { oddFooterMarkup = ##f }
`
  return txt
}

const transpose = (x, transp) =>
  transp > 0
    ? x + transp > 11
      ? x + transp - 12
      : x + transp
    : x + transp < 0
    ? x + transp + 12
    : x + transp

const transposeSet = (set, transp) => set.map(x => transpose(x, transp))

const triad = set => [set[0], set[2], set[4]]

const convertMovementToOctave = movement => {
  if (!movement.length) {
    return ''
  } else if (movement.length !== 2) {
    throw Error`Octave movement is formatted incorrectly.`
  } else {
    return movement[1].toLowerCase() === 'd'
      ? ','.repeat(movement[0])
      : "'".repeat(movement[0])
  }
}

const insertOctave = (set, octave) => [set[0] + octave, ...set.slice(1)]

module.exports = {
  quantSet,
  playScale,
  cellFold,
  sequence,
  randChordGen,
  formatterLy,
  printLilyPond,
  convertDigitToNoteSet,
  convertNoteToDigit,
  transposeSet,
  convertHumanToLySyntax,
  convertMovementToOctave,
  insertOctave,
  triad
}
