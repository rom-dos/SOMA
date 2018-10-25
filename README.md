<p align="center">
<img src="img/soma-logo-v2.png" alt="">
</p>



**compositional tools for manipulating LilyPond data and rendering MIDI**

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Dependencies

- [Node](https://nodejs.org/en/)
- [LilyPond](http://lilypond.org/)

## Use cases

**Use cases to fulfill**
1. Print the Major scale in all 12 keys, quantized in 1/4 notes, with a 1/4 note rest after each completion, ascending chromatically. 
2. Print the Minor scale in all 12 keys, quantized in 1/8 notes, with an 1/8 note rest after each completion, descending chromatically.
3. Print the Major pentatonic scale in all 12 keys, quantized in 1/4 note triplets, with a 1/4 note triplet rest after each completion, ascending up in 7ths.
4. Print 16 "throws" of single notes or chords, of random selection, from a supplied harmonic set, quantized in 1/8 notes.
5. Print 8 chords (variable # of voices), of random selection, from a supplied harmonic set, quantized in 1/2 notes.
6. Print the sum of 2 harmonic sets combined together, removing duplicate pitches.
7. Print the sum of 2 harmonic sets combined together, declaring # of pitches from each set and/or total # of pitches in new set.
8. Print x random notes from a supplied harmonic set.
9. Print a set reversed.
10. Print a set inverted x times.
11. Convert a linear set into a chord comprised of x voices, the chord taking on the combined duration of the individual voices.
12. Print x random rhythms, fitting in a 4/4 measure.
13. Print x random rhythms, fitting in a x measure, with range of quantization specified (i.e. 64th - 32nd notes, or 32nd - 1/4 notes)
14. Quantized set into tuplet (3:2, 5:4, 7:8, 9:8, 15:16...)

## API

### Time

#### `quantSet()`

```javascript
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
```

```javascript
quantSet(harmonic_sets.Major[10][1], 16);
// => [ 'bes16', 'c', 'd', 'ees', 'f', 'g', 'a']
```

#### `playScale()`

```javascript
// ^.-- Play Scale --.^ \\
let playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant);
  return localSet.join(' ');
}
```

```javascript
playScale(harmonic_sets.Major[0][1], 8);
// => 'c8 d e f g a b'
```

#### `randChordGen()`

```javascript
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
    finalChord = formatterLy(finalChord, 'chord');
    return finalChord;
  } else {
    return finalChord;
  }
}
```

```javascript
randChordGen(harmonic_sets.Major[3][1], 4, 'sort');
// => '<f c ees g>'
```

#### `repeater()`

```javascript
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
```

```javascript
let fMajor = randChordGen(harmonic_sets.Major[5][1], 4, 'sort');
repeater(fMajor, 4);
// => '<d c f a> <d c f a> <d c f a> <d c f a>'
```

#### `formatterLy()`

```javascript
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
        formattedSet = '<' + formattedSet + '>'
    }
    return formattedSet;
}
```

```javascript
let dMajor = quantSet(harmonic_sets.Major[2][1], 8);
formatterLy(dMajor);
// => 'd8 e ges g a b des'
```

#### `cellFold()`

```javascript
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
```

```javascript
cellFold(playScale(harmonic_sets.Major[10][1], 16), 'normal');
// => 'bes16 c d ees f g a g'
```

#### Arrangement

#### `sequence()`

```javascript
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
```

### Output

#### `printLilyPond(music, time)`

```javascript
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
```
