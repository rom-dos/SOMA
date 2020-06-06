import fs from 'fs'
import os from 'os'
import shell from 'shelljs'
import terminalImage from 'terminal-image'

const cache = `${os.homedir}/.cache/soma`

const cwd = process.cwd()
const rc = `${cwd}/somarc.json`
const score = `${cwd}/score.json`

export const timeStamp = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month =
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  const minutes =
    now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  const seconds =
    now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  return `${year}${month}${date}-${hours}-${minutes}-${seconds}`
}

export const readRc = () => {
  try {
    const read = fs.readFileSync(rc, 'utf8')
    return JSON.parse(read)
  } catch (err) {
    console.error(err)
  }
}

export const readScore = () => {
  try {
    const read = fs.readFileSync(score, 'utf8')
    return JSON.parse(read)
  } catch (err) {
    console.error(err)
  }
}

export const createSomaRc = (rcPath, options) => {
  fs.openSync(rcPath, 'a')
  writetoSomaRc(rcPath, {
    name: options.name,
    description: options.description,
    'stave-count': options.staves,
    tempo: options.tempo
  })
}

export const writetoSomaRc = (rcPath, data) => {
  try {
    const read = fs.readFileSync(rcPath, 'utf8')
    if (read) {
      console.log(true)
      // deal with this later
    } else {
      fs.writeFileSync(rcPath, JSON.stringify(data, null, 2), 'utf8')
      const readPost = fs.readFileSync(rcPath, 'utf8')
      console.log('')
      console.log(readPost)
    }
  } catch (err) {
    console.error(err)
  }
}

export const createScore = () => {
  try {
    fs.writeFileSync(
      `${process.cwd()}/score.json`,
      JSON.stringify({ a: [] }),
      'utf8'
    )
    console.log('')
    console.log(`New Score Created.`)
    console.log(`Output Directory: ${process.cwd()}.`)
  } catch (err) {
    console.error(err)
  }
}

export const writeScore = (input, replace = false, stave) => {
  try {
    const read = readScore()
    if (stave.toLowerCase() === 'dbl') {
      let staveOutputA
      let staveOutputB
      if (read['a']) {
        if (replace) {
          staveOutputA = input
        } else {
          staveOutputA = [...read['a'], input]
        }
      } else {
        staveOutputA = [input]
      }

      if (read['b']) {
        if (replace) {
          staveOutputB = input
        } else {
          staveOutputB = [...read['b'], input]
        }
      } else {
        staveOutputB = [input]
      }

      fs.writeFileSync(
        `${cwd}/score.json`,
        JSON.stringify(
          Object.assign({}, read, { a: staveOutputA, b: staveOutputB })
        ),
        'utf8'
      )
    } else {
      let staveOutput
      if (read[stave]) {
        if (replace) {
          staveOutput = input
        } else {
          staveOutput = [...read[stave], input]
        }
      } else {
        staveOutput = [input]
      }

      fs.writeFileSync(
        `${cwd}/score.json`,
        JSON.stringify(Object.assign({}, read, { [stave]: staveOutput })),
        'utf8'
      )
    }
    const readPost = readScore()
    console.log('')
    console.log(readPost)
  } catch (err) {
    console.error(err)
  }
}

export const output = (input, silent, width = 88) => {
  const time = timeStamp()
  const rc = readRc()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'

  if (typeof input === 'object') {
    fs.writeFileSync(
      `${cwd}/${time}.ly`,
      printLilyPondDouble(input, rc.tempo),
      err => {
        if (err) throw err
      }
    )
  } else {
    fs.writeFileSync(
      `${cwd}/${time}.ly`,
      printLilyPond(input, rc.tempo),
      err => {
        if (err) throw err
      }
    )

    console.log(false)
  }

  shell.exec(`${lilypond} -fpng -fpdf ${cwd}/${time}.ly`)
  shell.mv('*.png', `${cache}/`)
  shell.mv('*.ly', `${cwd}/ly/`)
  shell.mv('*.pdf', `${cwd}/pdf/`)
  shell.mv('*.midi', `${cwd}/midi/`)

  shell.rm('*.eps')
  shell.rm('*.count')
  shell.rm('*.tex')
  shell.rm('*.texi')

  // return time
  shell.exec(
    `magick convert ${cache}/${time}.png -channel RGB -negate ${cache}/${time}-white.png`
  )
  ;(async () => {
    console.log(
      await terminalImage.file(`${cache}/${time}-white.png`, {
        width: `${width}%`
      })
    )
    if (!silent) {
      shell.exec(`timidity ${cwd}/midi/${time}.midi`)
    }
  })()
}

export const printLilyPond = (music, tempo) => {
  const txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4
  \\tempo 4 = ${tempo}

      ${music} 
  }

  \\score {
    \\new PianoStaff
    <<
      \\new Staff = "upper" \\upper
    >>
    \\layout { }
    \\midi { }
    \\include "lilypond-book-preamble.ly"
  }
  \\paper { oddFooterMarkup = ##f }
`
  return txt
}

export const printLilyPondDouble = (music, tempo) => {
  const txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4
  \\tempo 4 = ${tempo}

      ${music.a.join(' ')} 
  }

  lower = \\relative c {
  \\clef bass
  \\key c \\major
  \\time 4/4
  \\tempo 4 = ${tempo}

      ${music.b.join(' ')} 
  }

  \\score {
    \\new PianoStaff
    <<
      \\new Staff = "upper" \\upper
      \\new Staff = "lower" \\lower
    >>
    \\layout { }
    \\midi { }
    \\include "lilypond-book-preamble.ly"
  }
  \\paper { oddFooterMarkup = ##f }
`
  return txt
}
