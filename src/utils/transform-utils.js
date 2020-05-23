export const convertMovementToOctave = movement => {
  if (!movement.length) {
    return ''
  } else if (movement.length !== 2) {
    throw Error`Octave movement is formatted incorrectly.`
  } else {
    return movement[1].toLowerCase() === 'd'
      ? ','.repeat(movement[0])
      : "'".repeat(movement[0])
  }
}

export const insertOctave = (set, octave) => [set[0] + octave, ...set.slice(1)]

const transpose = (x, transp) =>
  transp > 0
    ? x + transp > 11
      ? x + transp - 12
      : x + transp
    : x + transp < 0
    ? x + transp + 12
    : x + transp

export const transposeSet = (set, transp) => set.map(x => transpose(x, transp))

export const inversion = (set, inv) => {
  if (Number(inv) === 0) {
    return set
  } else {
    return [...set.slice(Number(inv)), ...set.slice(0, Number(inv))]
  }
}

export const cellFold = (str, type) => {
  switch (type.toLowerCase()) {
    case 'rest':
    case 'r':
      return `${str} r `
    case 'fold': {
      const arr = str.split(' ')
      arr.push(arr[arr.length - 2])
      return `${arr.join(' ')} `
    }
    case 'turnup':
      return `${str} ${str.match(/[a-z]+/i)} `
  }
}

export const formatterLy = (set, type = 'default') => {
  let formattedSet
  if (typeof set === 'string') {
    formattedSet = set
  } else {
    formattedSet = set.join(' ')
  }
  type = type.toLowerCase()
  if (type === 'chord') {
    formattedSet = '<' + formattedSet + '>'
  }
  return formattedSet
}

// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
export const quantSet = (set, quant = 4) => [
  set.slice(0, 1)[0].concat(quant),
  ...set.slice(1)
]
