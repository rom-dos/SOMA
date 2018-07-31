# soma

compositional tools for manipulating LilyPond data and rendering MIDI

## Dependencies

node

LilyPond

## API

#### `playScale()`

```javascript
// ^.-- Play Scale --.^ \\
// default quantization set to 1/4 notes
let playScale = (set, time = 4) => {
	let first = set[0];
    first += time;
    set[0] = first;
    let scale = set.join(' ');
    return scale;
}
```

```javascript
let cMajor1 = playScale(harmonic_sets.Major.c[1], 4));
```



#### `randChordGen()`

```javascript
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
        finalChord = finalChord.sort(a, b) => a - b);
        finalChord = finalChord.join(' ');
        finalChord = '<' + finalChord + '>' + 1 + ' | ';
        return finalChord;
    } else {
        return finalChord;
    }
}
```

```javascript
let cMajor1 = randChordGen(harmonic_sets.Major.c[1], 4, 'sort');
```

