/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { randChordGen } = require('../src/utils')

/* -- randChordGen -- */
describe('randChordGen', () => {
  test('returns an array (object)', () => {
    const test = randChordGen(harmonicSets['major']['c'][1], 3)
    expect(typeof test).toBe('object')
  })

  test('returns an array of 3 notes', () => {
    const test = randChordGen(harmonicSets['major']['db'][1], 3)
    expect(test.length).toEqual(3)
  })

  test('returns an array of 5 notes', () => {
    const test = randChordGen(harmonicSets['major']['d'][1], 5)
    expect(test.length).toEqual(5)
  })

  test('returns an array of 7 notes', () => {
    const test = randChordGen(harmonicSets['minor']['c'][1], 7)
    expect(test.length).toEqual(7)
  })
})
