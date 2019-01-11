/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { playScale } = require('../src/utils')

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
