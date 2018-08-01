const fs = require('fs');
// Harmonic Sets
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

let cMajor1 = randChordGen(harmonic_sets.Minor.db[1], 4, 'sort');
let cMajor2 = playScale(harmonic_sets.Major.c[1], 4);

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

let c10 = repeater(cMajor1, 10);

// Print

const printLilyPond = (music) => {
  let txt = `\\version "2.18.2"
  
  upper = \\relative c'' {
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

// printLilyPond(cMajor1);

fs.writeFile('../output/30VII2018-3.ly', printLilyPond(cMajor1), err => {
  if (err) throw err;

  console.log("Success!");
})
