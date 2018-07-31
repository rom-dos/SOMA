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
    finalChord = finalChord.join(' ');
    finalChord = '<' + finalChord + '>' + 1 + ' | ';
    return finalChord;
    // console.log(finalChord);
  } else {
    return finalChord;
    // return finalChord;
  }
}

let cMajor1 = randChordGen(harmonic_sets.Major.c[1], 4, 'sort');
let cMajor2 = playScale(harmonic_sets.Major.c[1], 4);

let repeater = (chord, count) => {
  let repeat = '';
  let i = 0;
  while (i < count) {
    repeat += chord;
    i++;
  }
  return repeat;
}

let c10 = repeater(cMajor1, 10);

const formatterLy = (arr) => {
  let formattedSet = arr.join(' ');
  return formattedSet;
}

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

fs.writeFile('../output/30VII2018-2.ly', printLilyPond(cMajor1), err => {
  if (err) throw err;

  console.log("Success!");
})

