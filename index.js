const fs = require('fs');


cMajor = [0,2,4,5,7,9,11];
dbMajor = [1,3,5,6,8,10,12];
dMajor = [];
ebMajor = [];
eMajor = [];
fMajor = [];
gbMajor = [];
gMajor = [];
abMajor = [];
aMajor = [];
bbMajor = [];

cMinor = [];
dbMinor = [];
dMinor = [];
ebMinor = [];
eMinor = [];
fMinor = [];
gbMinor = [];
gMinor = [];
abMinor = [];
aMinor = [];
bbMinor = [];
bMinor = [11,1,];

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

let test = randChordGen(cMajor, 4, 'sort');

fs.writeFile('test.ly', test, err => {
  if (err) throw err;

  console.log("Success!");
})
