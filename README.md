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



#### `repeater()`

```javascript
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
```

```javascript
let c10 = repeater(cMajor1, 10);
```



#### `formatterLy()`

```javascript
// ^.-- LilyPond Formatter --.^ \\
const formatterLy = (arr, type = 'default') => {
    let formattedSet = arr.join(' ');
    
    type = type.toLowerCase();
    if (type === 'chord') {
        formattedSet = '<' + formattedSet + '>'
    }
    return formattedSet;
}
```

```javascript
formatterLy(finalChord, 'chord');
```

