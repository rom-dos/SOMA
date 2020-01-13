/* eslint-env jest */
const harmonicSets = require('../src/harmonicSets')
const { cellFold, playScale } = require('../src/utils')

/* -- cellFold -- */
describe('cellFold', () => {
  test.skip('returns a string', () => {
    const test = cellFold(playScale(harmonicSets.major['c'][1], 4), 'rest')
    expect(typeof test).toEqual('string')
  })

  test.skip('returns a scale with a rest appended to the end (v1)', () => {
    const test = cellFold(playScale(harmonicSets.major['d'][1], 4), 'r')
    expect(test).toEqual('d4 e ges g a b des r ')
  })

  test.skip('returns a scale with a rest appended to the end (v2)', () => {
    const test = cellFold(playScale(harmonicSets.major['db'][1], 4), 'rest')
    expect(test).toEqual('des4 ees f ges aes bes c r ')
  })

  test.skip('returns a scale folded to the second to last note at the end', () => {
    const test = cellFold(playScale(harmonicSets.major['e'][1], 8), 'fold')
    expect(test).toEqual('e8 ges aes a b des ees des ')
  })

  test.skip('retuns a scale extended to the root note an octave up at the end', () => {
    const test = cellFold(playScale(harmonicSets.major['f'][1], 8), 'turnup')
    expect(test).toEqual('f8 g a bes c d e f ')
  })
})
