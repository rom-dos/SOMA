import fs from 'fs'
import os from 'os'
import shell from 'shelljs'
import terminalImage from 'terminal-image'
import { harmonicSets } from './harmonicSets.js'

const cache = `${os.homedir}/.cache/soma`

/* eslint-disable */
String.prototype.regexIndexOf = function (regex, startpos) {
  let indexOf = this.substring(startpos || 0).search(regex)
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf
}
/* eslint-enable */

// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
export const quantSet = (set, quant = 4) => [
  set.slice(0, 1)[0].concat(quant),
  ...set.slice(1)
]

export const playScale = (set, quant = 4) => quantSet(set, quant).join(' ')

export const cellFold = (str, type) => {
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

export const convertDigitToNoteSet = set => set.map(x => digitToNote[x])

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

export const convertNoteToDigit = note => noteToDigit[note]

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

export const convertHumanToLySyntax = note => humanToLy[note.toLowerCase()]

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

export const formatterLy = (set, type = 'default') => {
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

export const printLilyPond = (music, time) => {
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

export const transposeSet = (set, transp) => set.map(x => transpose(x, transp))

export const triad = set => [set[0], set[2], set[4]]

export const seventhChord = set => [set[0], set[2], set[4], set[6]]

export const dimSeventhChord = set => [set[6], set[1], set[3], set[5]]

export const inversion = (set, inv) => {
  if (Number(inv) === 0) {
    return set
  } else {
    return [...set.slice(Number(inv)), ...set.slice(0, Number(inv))]
  }
}

export const convertMovementToOctave = movement => {
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

export const insertOctave = (set, octave) => [set[0] + octave, ...set.slice(1)]

export const createScore = (name = '') => {
  try {
    if (name) {
      fs.writeFileSync(`${cache}/${name}.json`, '{}', 'utf8')
      console.log(`New Score ${name} Created.`)
    } else {
      fs.writeFileSync(`${cache}/score.json`, '{}', 'utf8')
      console.log('New Score Created.')
    }
  } catch (err) {
    console.error(err)
  }
}

export const writeScore = (input, replace = false) => {
  try {
    let output
    const read = readScore()
    if (read['one']) {
      if (replace) {
        output = input
      } else {
        output = [...read['one'], input]
      }
    } else {
      output = [input]
    }
    fs.writeFileSync(
      `${cache}/score.json`,
      JSON.stringify({ one: output }),
      'utf8'
    )
    const readPost = readScore()
    console.log(readPost)
  } catch (err) {
    console.error(err)
  }
}

export const readScore = () => {
  try {
    const data = fs.readFileSync(`${cache}/score.json`, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
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

export const timeStamp = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month =
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  const minutes =
    now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  const seconds =
    now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  return `${year}${month}${date}-${hours}-${minutes}-${seconds}`
}

export const output = input => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'
  const outputDir = `${os.homedir}/soma-output`

  fs.writeFileSync(
    `${os.homedir}/soma-output/${time}.ly`,
    printLilyPond(input),
    err => {
      if (err) throw err
    }
  )

  shell.exec(`${lilypond} -fpng -fpdf ${outputDir}/${time}.ly`)
  shell.mv('*.pdf', '*.midi', '*.png', `${outputDir}/`)

  // return time
  shell.exec(
    `magick convert ${outputDir}/${time}.png -channel RGB -negate ${outputDir}/${time}-white.png`
  )
  ;(async () => {
    console.log(
      await terminalImage.file(`${outputDir}/${time}-white.png`, {
        width: '88%',
        height: '16%'
      })
    )
  })()
}

export const chordGen = (key, type, octave, inv, duration) => {
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
    )}>${duration}`
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
    )}>${duration}`
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
    )}>${duration}`
  }

  return data
}
