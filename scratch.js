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
const cellFold = (str) => {
  let newArr = str.split(' '); 
  newArr.push(newArr[newArr.length - 2]);
  let newStr = newArr.join(' ');
  console.log(newStr);
}
cellFold(testScale);


let myScale = ['c','d','e','f','g','a','b'];
// playScale(myScale, 4);
