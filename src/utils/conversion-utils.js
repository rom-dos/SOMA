const digitToNote = {
  0: 'c',
  1: 'des',
  2: 'd',
  3: 'ees',
  4: 'e',
  5: 'f',
  6: 'ges',
  7: 'g',
  8: 'aes',
  9: 'a',
  10: 'bes',
  11: 'b'
}

const noteToDigit = {
  c: 0,
  des: 1,
  d: 2,
  ees: 3,
  e: 4,
  f: 5,
  ges: 6,
  g: 7,
  aes: 8,
  a: 9,
  bes: 10,
  b: 11
}

const humanToLy = {
  c: 'c',
  db: 'des',
  d: 'd',
  eb: 'ees',
  e: 'e',
  f: 'f',
  gb: 'ges',
  g: 'g',
  ab: 'aes',
  a: 'a',
  bb: 'bes',
  b: 'b'
}

export const convertDigitToNoteSet = set => set.map(x => digitToNote[x])

export const convertNoteToDigit = note => noteToDigit[note]

export const convertHumanToLySyntax = note => humanToLy[note.toLowerCase()]
