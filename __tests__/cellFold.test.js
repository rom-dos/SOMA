/* eslint-env jest */
const { cellFold } = require('../src/utils')

/* -- cellFold -- */
describe('cellFold', () => {
  test('returns a string', () => {
    const scaleString = 'c4 d e f g a b'
    const test = cellFold(scaleString, 'rest')
    expect(typeof test).toEqual('string')
  })

  test('returns a scale with a rest appended to the end (v1)', () => {
    const scaleString = 'd4 e ges g a b des'
    const test = cellFold(scaleString, 'r')
    const expected = 'd4 e ges g a b des r '
    expect(test).toEqual(expected)
  })

  test('returns a scale with a rest appended to the end (v2)', () => {
    const scaleString = 'des4 ees f ges aes bes c'
    const test = cellFold(scaleString, 'rest')
    const expected = 'des4 ees f ges aes bes c r '
    expect(test).toEqual(expected)
  })

  test('returns a scale folded to the second to last note at the end', () => {
    const scaleString = 'e8 ges aes a b des ees'
    const test = cellFold(scaleString, 'fold')
    const expected = 'e8 ges aes a b des ees des '
    expect(test).toEqual(expected)
  })

  test('retuns a scale extended to the root note an octave up at the end', () => {
    const scaleString = 'f8 g a bes c d e'
    const test = cellFold(scaleString, 'turnup')
    const expected = 'f8 g a bes c d e f '
    expect(test).toEqual(expected)
  })
})
