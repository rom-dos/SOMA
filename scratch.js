// ^.-- Play Scale --.^ \\
let playScale = (set, time) => {
  let first = set[0];
  first += time;
  set[0] = first;
  let scale = set.join(' ');
  console.log(scale);
}

let myScale = ['c','d','e','f','g','a','b'];
playScale(myScale, 4);
