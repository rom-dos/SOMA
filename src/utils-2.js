const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const utils = require('./utils.js')

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

// ^.-- Cell Fold --.^ \\
const cellFold = (str, type) => {
  if (type.toLowerCase() === 'rest') {
    str += ' r | '
    return str
  } else {
    let newArr = str.split(' ')
    newArr.push(newArr[newArr.length - 2])
    let newStr = newArr.join(' ')
    return newStr
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

String.prototype.regexIndexOf = function(regex, startpos) {
  var indexOf = this.substring(startpos || 0).search(regex)
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf
}

const sequence = () => {
  let data = ''
  data += cellFold(playScale(harmonicSets.Major[0][1], 8), 'rest')
  for (let i = 1; i <= 11; i++) {
    let newLine = cellFold(playScale(harmonicSets.Major[i][1], 8), 'rest')
    newLine = newLine.split(' ')
    let firstNote = newLine[0]
    let splicePoint = firstNote.regexIndexOf(/[0-9]/, 0)
    newLine[0] = firstNote.slice(0, splicePoint) + ',' + firstNote.slice(splicePoint)
    newLine = newLine.join(' ')
    data += newLine
  }
  return data
}

let test = sequence()

/*
fs.writeFile('../output/runtime081018.ly', printLilyPond(test), err => {
  if (err) throw err

  console.log('Success!')
})
*/
