/* eslint-env jest */
const { convertNoteToDigit } = require('../src/utils')

describe('convertNoteToDigit', () => {
  test('returns a number', () => {
    const note = 'c'
    const test = convertNoteToDigit(note)
    expect(typeof test).toEqual('number')
  })

  test('returns 0 for c', () => {
    const note = 'c'
    const test = convertNoteToDigit(note)
    const expected = 0
    expect(test).toEqual(expected)
  })

  test('returns 7 for g', () => {
    const note = 'g'
    const test = convertNoteToDigit(note)
    const expected = 7
    expect(test).toEqual(expected)
  })

  test('returns 11 for b', () => {
    const note = 'b'
    const test = convertNoteToDigit(note)
    const expected = 11
    expect(test).toEqual(expected)
  })
})
