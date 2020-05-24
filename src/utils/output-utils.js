import fs from 'fs'
import os from 'os'
import shell from 'shelljs'
import terminalImage from 'terminal-image'

const cache = `${os.homedir}/.cache/soma`

const cwd = process.cwd()

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

export const createScore = options => {
  try {
    if (options.name) {
      fs.writeFileSync(
        `${cwd}/${options.name}.json`,
        JSON.stringify({}),
        'utf8'
      )
      console.log(`New Score ${options.name} Created.`)
    } else {
      fs.writeFileSync(
        `${process.cwd()}/score.json`,
        JSON.stringify({ a: [] }),
        'utf8'
      )
      console.log('New Score Created.')
    }
    console.log(`Output Directory: ${cwd}.`)
  } catch (err) {
    console.error(err)
  }
}

export const readScore = () => {
  try {
    const data = fs.readFileSync(`${cwd}/score.json`, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}

export const writeScore = (input, replace = false, stave) => {
  try {
    const read = readScore()
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
    const readPost = readScore()
    console.log('')
    console.log(readPost)
  } catch (err) {
    console.error(err)
  }
}

export const output = input => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'

  fs.writeFileSync(`${cwd}/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err
  })

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
        width: '88%',
        height: '16%'
      })
    )
  })()
}

export const printLilyPond = (music, time) => {
  const txt = `\\version "2.18.2"
  
  upper = \\relative c' {
  \\clef treble
  \\key c \\major
  \\time 4/4

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
