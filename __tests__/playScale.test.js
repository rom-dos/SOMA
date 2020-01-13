/* eslint-env jest */
const { playScale } = require('../src/utils')

/* -- playScale -- */
describe('playScale', () => {
  test('returns a string', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = playScale(set)
    expect(typeof test).toEqual('string')
  })

  test('returns a scale quantized in 1/4 notes', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = playScale(set)
    const expected = 'c4 d e f g a b'
    expect(test).toEqual(expected)
  })

  test('retuns a scale quantized in 1/16 notes', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = playScale(set, 16)
    const expected = 'c16 d e f g a b'
    expect(test).toEqual(expected)
  })
})
