const harmonicSets = require('./harmonicSets')

// ^.-- quant --.^ \\
// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
const quantSet = (set, quant = 4) => {
  let localSet = set
  let first = localSet[0]
  first += quant
  localSet[0] = first
  return localSet
}

// ^.-- Play Scale --.^ \\
const playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant)
  return localSet.join(' ')
}

// ^.-- Cell Fold --.^ \\
const cellFold = (str, type) => {
  if (type.toLowerCase() === 'rest' || type.toLowerCase() === 'r') {
    str += ' r '
    return str
  } else if (type.toLowerCase() === 'fold') {
    let newArr = str.split(' ')
    newArr.push(newArr[newArr.length - 2])
    let newStr = `${newArr.join(' ')} `
    return newStr
  } else if (type.toLowerCase() === 'turnup') {
    let newStr = str
    newStr += ` ${newStr.match(/[a-z]+/i)} `
    return newStr
  }
}

/* eslint-disable */
String.prototype.regexIndexOf = function (regex, startpos) {
  let indexOf = this.substring(startpos || 0).search(regex)
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf
}
/* eslint-enable */

const sequence = (type, quant, tail) => {
  const all = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']

  let data = ''
  data += cellFold(playScale(harmonicSets[type]['c'][1], quant), tail)
  all.slice(1).forEach(i => {
    let newLine = cellFold(playScale(harmonicSets[type][i][1], quant), tail)
    newLine = newLine.split(' ')
    let firstNote = newLine[0]
    let splicePoint = firstNote.regexIndexOf(/[0-9]/, 0)
    newLine[0] = firstNote.slice(0, splicePoint) + ',' + firstNote.slice(splicePoint)
    newLine = newLine.join(' ')
    data += newLine
  })

  return data
}

// ^.-- PRINT --.^ \\
const printLilyPond = (music, time) => {
  let txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4

      ${music} 
  }

  lower = \\relative c {
  \\clef bass
  \\key c \\major
  \\time 4/4

    r1 |  
  }

  \\score {
    \\new PianoStaff \\with { instrumentName = #"Piano" }
    <<
      \\new Staff = "upper" \\upper
      \\new Staff = "lower" \\lower
    >>
    \\layout { }
    \\midi { }
  }
`
  return txt
}

/*
// ^.-- LilyPond Formatter --.^ \\
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

// ^.-- Random Chord Generator --.^ \\
const randChordGen = (arr, count, order) => {
  let finalChord = []

  const randNote = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  while (finalChord.length < count) {
    let newNote = randNote(arr)
    if (finalChord.includes(newNote) === false) {
      finalChord.push(newNote)
    }
  }
  if (order === 'sort') {
    finalChord = finalChord.sort((a, b) => a - b)
    finalChord = formatterLy(finalChord, 'chord')
    return finalChord
  } else {
    return finalChord
  }
}

// ^.-- Repeater --.^ \\
let repeater = (music, reps) => {
  let repeat = ''
  let i = 0
  while (i < reps) {
    repeat += music + ' '
    i++
  }
  return repeat
}

let test = sequence()
*/

module.exports = {
  playScale,
  cellFold,
  sequence,
  printLilyPond
}
