/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { quantSet, playScale } = require('../src/utils')

/* -- quantSet -- */
describe('quantSet', () => {
  test('returns an object', () => {
    const test = quantSet(harmonicSets.minor['db'][1], 16)
    expect(typeof test).toEqual('object')
  })

  test('quantizes the set in 1/4 notes when given an argument for quant', () => {
    const test = quantSet(harmonicSets.major['c'][1], 4)
    expect(test).toEqual(['c4', 'd', 'e', 'f', 'g', 'a', 'b'])
  })

  test('quantizes the set in 1/4 notes when using the default parameter for quant', () => {
    const test = quantSet(harmonicSets.major['db'][1])
    expect(test).toEqual(['des4', 'ees', 'f', 'ges', 'aes', 'bes', 'c'])
  })

  test('quantizes the set in 1/32 notes', () => {
    const test = quantSet(harmonicSets.minor['eb'][1], 32)
    expect(test).toEqual(['ees32', 'f', 'ges', 'aes', 'bes', 'c', 'des'])
  })
})

/* -- playScale -- */
describe('playScale', () => {
  test('returns a string', () => {
    const test = playScale(harmonicSets.major['c'][1])
    expect(typeof test).toEqual('string')
  })

  test('returns a scale quantized in 1/4 notes', () => {
    const test = playScale(harmonicSets.major['d'][1])
    expect(test).toEqual('d4 e ges g a b des')
  })

  test('retuns a scale quantized in 1/16 notes', () => {
    const test = playScale(harmonicSets.minor['d'][1], 16)
    expect(test).toEqual('d16 e f g a b c')
  })
})
