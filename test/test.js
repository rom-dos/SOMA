const harmonicSets = require('../src/harmonicSets.js')
const utils = require('../src/utils.js')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()

// ^.-- quant --.^ \\
describe('quantSet() Set comparison', () => {
  it('quantizes the set in 1/4 notes', () => {
    const test = utils.quantSet(harmonicSets.Major['c'][1])
    assert.deepEqual(test, [ 'c4', 'd', 'e', 'f', 'g', 'a', 'b' ])
  })

  it('quantizes the set in 1/32 notes', () => {
    const test = utils.quantSet(harmonicSets.Minor['eb'][1], 32)
    assert.deepEqual(test, [ 'ees32', 'f', 'ges', 'aes', 'bes', 'c', 'des' ])
  })
})

// ^.-- playScale --.^ \\
describe('playScale() String verification', () => {
  it('returns a scale (string) quantized in 1/4 notes', () => {
    const test = utils.playScale(harmonicSets.Major['d'][1])
    assert.equal(test, 'd4 e ges g a b des')
  })

  it('return a scale (string) quantized in 1/16 notes', () => {
    const test = utils.playScale(harmonicSets.Minor['d'][1], 16)
    assert.equal(test, 'd16 e f g a b c')
  })
})
