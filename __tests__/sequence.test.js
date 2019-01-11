/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { sequence } = require('../src/utils')

/* -- sequence -- */
describe('sequence', () => {
  test('returns a string (from 3 keys input)', () => {
    const test = sequence('c d e', 'major', 4, 'fold')
    expect(typeof test).toEqual('string')
  })

  test('returns a string (from all major keys input)', () => {
    const seq = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
    const test = sequence(seq, 'major', 4, 'fold')
    expect(typeof test).toEqual('string')
  })

  test('returns a string (from all minor keys input)', () => {
    const seq = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
    const test = sequence(seq, 'minor', 4, 'fold')
    expect(typeof test).toEqual('string')
  })

  test('returns a sequence of 96 notes (all keys)', () => {
    const seq = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
    const test = sequence(seq, 'major', 4, 'fold')
      .split(' ')
      .filter(char => char !== ' ' && char !== '')
    expect(test.length).toEqual(96)
  })

  test('returns a sequnece of 24 notes (3 keys)', () => {
    const test = sequence('f a c', 'major', 4, 'rest')
      .split(' ')
      .filter(char => char !== ' ' && char !== '')
    expect(test.length).toEqual(24)
  })

  test('returns a sequence of 16 notes (2 keys)', () => {
    const test = sequence('c d', 'major', 16, 'fold')
      .split(' ')
      .filter(char => char !== ' ' && char !== '')
    expect(test.length).toEqual(16)
  })
})
