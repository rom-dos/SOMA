/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { quantSet } = require('../src/utils')

/* -- quantSet -- */
describe('quantSet', () => {
  test.skip('returns an object', () => {
    const test = quantSet(harmonicSets.minor['db'][1], 16)
    expect(typeof test).toEqual('object')
  })

  test.skip('quantizes the set in 1/4 notes when given an argument for quant', () => {
    const test = quantSet(harmonicSets.major['c'][1], 4)
    expect(test).toEqual(['c4', 'd', 'e', 'f', 'g', 'a', 'b'])
  })

  test.skip('quantizes the set in 1/4 notes when using the default parameter for quant', () => {
    const test = quantSet(harmonicSets.major['db'][1])
    expect(test).toEqual(['des4', 'ees', 'f', 'ges', 'aes', 'bes', 'c'])
  })

  test.skip('quantizes the set in 1/32 notes', () => {
    const test = quantSet(harmonicSets.minor['eb'][1], 32)
    expect(test).toEqual(['ees32', 'f', 'ges', 'aes', 'bes', 'c', 'des'])
  })
})
