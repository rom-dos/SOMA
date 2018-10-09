// ^.-- quant --.^ \\
// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
const quantSet = (set, quant = 4) => {
  let localSet = set
  let first = localSet[0]
  first += quant
  localSet[0] = first
  return localSet
}

// ^.-- Play Scale --.^ \\
let playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant)
  return localSet.join(' ')
}

module.exports = {
  quantSet,
  playScale
}
