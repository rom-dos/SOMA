const fs = require('fs');
const harmonic_sets = require('./harmonic_sets')

// ^.-- quant --.^ \\
// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
let quantSet = (set, quant = 4) => {
  let localSet = set;
  let first = localSet[0];
  first += quant;
  localSet[0] = first;
  return localSet;
}

// ^.-- Play Scale --.^ \\
let playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant);
  return localSet.join(' ');
}

// ^.-- LilyPond Formatter --.^ \\
const formatterLy = (set, type = 'default') => {
  let formattedSet;
  if (typeof set === 'string') {
    formattedSet = set;
  } else {
    formattedSet = set.join(' ');
  }
  type = type.toLowerCase();
  if (type === 'chord') {
    formattedSet = '<' + formattedSet + '>';
  }
  return formattedSet;
}

// ^.-- Random Chord Generator --.^ \\
const randChordGen = (arr, count, order) => {
  let finalChord = [];

  const randNote = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  while (finalChord.length < count) {
    let newNote = randNote(arr);
    if (finalChord.includes(newNote) === false) {
      finalChord.push(newNote);
    }
  }
  if (order === 'sort') {
    finalChord = finalChord.sort((a, b) => a - b);
    finalChord = formatterLy(finalChord, 'chord');
    return finalChord;
  } else {
    return finalChord;
  }
}

// ^.-- Cell Fold --.^ \\
const cellFold = (str, type) => {
  if (type.toLowerCase() === 'rest') {
    str += " r | ";
    return str;
  } else {
    let newArr = str.split(' ');
    newArr.push(newArr[newArr.length - 2]);
    let newStr = newArr.join(' ');
    return newStr;
  }
}

// ^.-- Repeater --.^ \\
let repeater = (music, reps) => {
  let repeat = '';
  let i = 0;
  while (i < reps) {
    repeat += music + ' ';
    i++;
  }
  return repeat;
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

const sequence = () => {
  let data = '';
  data += cellFold(playScale(harmonic_sets.Major[0][1], 8), 'rest');
  for (let i = 1; i <= 11; i++) {
    let newLine = cellFold(playScale(harmonic_sets.Major[i][1], 8), 'rest');
    newLine = newLine.split(' ');
    let firstNote = newLine[0];
    let splicePoint = firstNote.regexIndexOf(/[0-9]/, 0);
    newLine[0] = firstNote.slice(0, splicePoint) + ',' + firstNote.slice(splicePoint);
    newLine = newLine.join(' ');
    data += newLine;
  }
  return data;
}

let test = sequence();

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
`;
  return txt;
}

fs.writeFile('../output/runtime.ly', printLilyPond(test), err => {
  if (err) throw err;

  console.log("Success!");
})

