import fs from 'fs'
import os from 'os'
import shell from 'shelljs'
import terminalImage from 'terminal-image'

const cache = `${os.homedir}/.cache/soma`

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

export const createScore = (name = '') => {
  try {
    if (name) {
      fs.writeFileSync(`${cache}/${name}.json`, '{}', 'utf8')
      console.log(`New Score ${name} Created.`)
    } else {
      fs.writeFileSync(`${cache}/score.json`, '{}', 'utf8')
      console.log('New Score Created.')
    }
  } catch (err) {
    console.error(err)
  }
}

export const readScore = () => {
  try {
    const data = fs.readFileSync(`${cache}/score.json`, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}

export const writeScore = (input, replace = false) => {
  try {
    let output
    const read = readScore()
    if (read['one']) {
      if (replace) {
        output = input
      } else {
        output = [...read['one'], input]
      }
    } else {
      output = [input]
    }
    fs.writeFileSync(
      `${cache}/score.json`,
      JSON.stringify({ one: output }),
      'utf8'
    )
    const readPost = readScore()
    console.log(readPost)
  } catch (err) {
    console.error(err)
  }
}

export const output = input => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'
  const outputDir = `${os.homedir}/soma-output`

  fs.writeFileSync(
    `${os.homedir}/soma-output/${time}.ly`,
    printLilyPond(input),
    err => {
      if (err) throw err
    }
  )

  shell.exec(`${lilypond} -fpng -fpdf ${outputDir}/${time}.ly`)
  shell.mv('*.pdf', '*.midi', '*.png', `${outputDir}/`)

  // return time
  shell.exec(
    `magick convert ${outputDir}/${time}.png -channel RGB -negate ${outputDir}/${time}-white.png`
  )
  ;(async () => {
    console.log(
      await terminalImage.file(`${outputDir}/${time}-white.png`, {
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
