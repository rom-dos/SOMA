/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const utils = require('../src/utils')

/* -- quantSet() -- */
describe('quantSet', () => {
  test('quantizes the set in 1/4 notes', () => {
    const test = utils.quantSet(harmonicSets.major['c'][1])
    expect(test).toEqual(['c4', 'd', 'e', 'f', 'g', 'a', 'b'])
  })
})
