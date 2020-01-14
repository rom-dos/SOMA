/* eslint-env jest */
const { convertDigitToNoteSet } = require('../src/utils')

describe('convertDigitToNoteSet', () => {
  test('returns an object string', () => {
    const set = [0, 2, 4, 5, 7, 9, 11]
    const test = convertDigitToNoteSet(set)
    expect(typeof test).toEqual('object')
  })

  test('returns an array of notes', () => {
    const set = [0, 2, 4, 5, 7, 9, 11]
    const test = convertDigitToNoteSet(set)
    const expected = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    expect(test).toEqual(expected)
  })
})
