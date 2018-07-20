const fs = require('fs');
const harmonic_sets = require('./harmonic_sets')

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
    return finalChord;
  } else {
    return finalChord;
  }
}

let test = randChordGen(harmonic_sets.Major.c[1], 4, 'sort');

fs.writeFile('test.txt', test, err => {
  if (err) throw err;

  console.log("Success!");
})
