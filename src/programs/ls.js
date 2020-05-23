import { chordTypes } from '../chordTypes.js'
import { scaleTypes } from '../scaleTypes.js'

export const ls = options => {
  if (options.chords) {
    console.log('')
    console.log('Available chords:')
    console.log('')
    chordTypes.map(x => console.log(x.name))
  }
  if (options.scales) {
    console.log('')
    console.log('Available scales:')
    console.log('')
    scaleTypes.map(x => console.log(x.name))
  }
}
