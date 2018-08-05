/*
// ^.-- Play Scale --.^ \\
let playScale = (set, time) => {
  let first = set[0];
  first += time;
  set[0] = first;
  let scale = set.join(' ');
  console.log(scale);
}
*/

/*
const formatterLy = (arr, type = 'default') => {
  let formattedSet = arr.join(' ');

  type = type.toLowerCase();
  if (type === 'chord') {
    formattedSet = '<' + formattedSet + '>';
  }
  return formattedSet;
}

let testScale = ['c','d','e','g','a'];
testScale = testScale.join(' ');

// ^.-- Cell Fold --.^ \\
const cellFold = (str, type) => {
  if (type.toLowerCase() === 'rest') {
    str += " r | ";
    console.log(str);
  } else {
    let newArr = str.split(' '); 
    newArr.push(newArr[newArr.length - 2]);
    let newStr = newArr.join(' ');
    console.log(newStr);
  }
}
cellFold(testScale, 'rest');
*/

let myScale = ['c','d','e','f','g','a','b'];

let quantSet = (set, quant = 4) => {
  let localSet = set;
  let first = localSet[0];
  first += quant;
  localSet[0] = first;
  return localSet;
}

// ^.-- Play Scale --.^ \\
// default quantization set to 1/4 notes
let playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant);
  return localSet.join(' ');
  // return scale;
}
console.log(playScale(myScale));


// playScale(myScale, 4);
