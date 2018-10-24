// ^.-- quant --.^ \\
// 1 = whole note, 2 = 1/2 note, 4 = 1/4 note, 8 = 1/8 note
// 16 = 1/16 note, 32 = 1/32 note, 64 = 1/64 note, 128 = 1/128 note
// default quantization set to 1/4 notes
const quantSet = (set, quant = 4) => {
  let localSet = set
  let first = localSet[0]
  first += quant
  localSet[0] = first
  return localSet
}

// ^.-- Play Scale --.^ \\
const playScale = (set, quant = 4) => {
  let localSet = quantSet(set, quant)
  return localSet.join(' ')
}

// ^.-- PRINT --.^ \\
const printLilyPond = (music, time) => {
  let txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4

      ${music} 
  }

  lower = \\relative c {
  \\clef bass
  \\key c \\major
  \\time 4/4

    r1 |  
  }

  \\score {
    \\new PianoStaff \\with { instrumentName = #"Piano" }
    <<
      \\new Staff = "upper" \\upper
      \\new Staff = "lower" \\lower
    >>
    \\layout { }
    \\midi { }
  }
`
  return txt
}

module.exports = {
  quantSet,
  playScale,
  printLilyPond
}
