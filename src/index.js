const fs = require('fs');
const harmonic_sets = require('./harmonic_sets')

// ^.-- quant --.^ \\
// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note

// ^.-- Play Scale --.^ \\
// default quantization set to 1/4 notes
let playScale = (set, quant = 4) => {
  let first = set[0];
  first += quant;
  set[0] = first;
  let scale = set.join(' ');
  return scale;
}

// ^.-- LilyPond Formatter --.^ \\
const formatterLy = (arr, type = 'default') => {
  let formattedSet = arr.join(' ');

  type = type.toLowerCase();
  if (type === 'chord') {
    formattedSet = '<' + formattedSet + '>';
  }
  return formattedSet;
}

// ^.-- Random Chord Generator --.^ \\
let randChordGen = (arr, count, order) => {
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
    // finalChord = '<' + finalChord + '>' + 1 + ' | ';
    finalChord = formatterLy(finalChord, 'chord');
    return finalChord;
    // console.log(finalChord);
  } else {
    return finalChord;
    // return finalChord;
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
    repeat += music;
    i++;
  }
  return repeat;
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

// console.log(playScale(harmonic_sets.Major[0][1], 4).regexIndexOf(/[0-9]/, 0));
// let cMajor1 = randChordGen(harmonic_sets.Minor.db[1], 4, 'sort');
// let cMajor2 = playScale(harmonic_sets.Major.c[1], 4);
// let c10 = repeater(cMajor1, 10);
// runtime = cellFold(playScale(harmonic_sets.Major.c[1], 4), 'rest');
// runtime += cellFold(playScale(harmonic_sets.Major.d[1], 4), 'rest');
// console.log(playScale(harmonic_sets.Major.db[1], 4));

const sequence = () => {
  let data = '';
  data += cellFold(playScale(harmonic_sets.Major[0][1], 8), 'rest');
  for (let i = 1; i <= 11; i++) {
    let newLine = cellFold(playScale(harmonic_sets.Major[i][1], 8), 'rest');
    newLine = newLine.split(' ');
    let firstNote = String(newLine[0]);
    let splicePoint = firstNote.regexIndexOf(/[0-9]/, 0);
    firstNote = firstNote.slice(0, splicePoint) + ',' + firstNote.slice(splicePoint);
    // firstNote = firstNote.split('');
    // firstNote = firstNote.splice(splicePoint, 0, ',');
    // firstNote = firstNote.join();
    // console.log(firstNote);
    newLine[0] = firstNote;
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

