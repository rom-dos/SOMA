/* eslint-env jest */
const { quantSet } = require('../src/utils')

/* -- quantSet -- */
describe('quantSet', () => {
  test('returns an object', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = quantSet(set, 16)
    expect(typeof test).toEqual('object')
  })

  test('quantizes the set in 1/4 notes when given an argument for quant', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = quantSet(set, 4)
    const expected = ['c4', 'd', 'e', 'f', 'g', 'a', 'b']
    expect(test).toEqual(expected)
  })

  test('quantizes the set in 1/4 notes when using the default parameter for quant', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = quantSet(set)
    const expected = ['c4', 'd', 'e', 'f', 'g', 'a', 'b']
    expect(test).toEqual(expected)
  })

  test('quantizes the set in 1/32 notes', () => {
    const set = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
    const test = quantSet(set, 32)
    const expected = ['c32', 'd', 'e', 'f', 'g', 'a', 'b']
    expect(test).toEqual(expected)
  })
})
