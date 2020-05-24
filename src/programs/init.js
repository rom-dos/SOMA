// import { createScore } from '../utils/output-utils.js'
import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

const createSomaRc = (rcPath, options) => {
  fs.openSync(rcPath, 'a')
  writetoSomaRc(rcPath, {
    name: options.name,
    description: options.description,
    'stave-count': options.staves,
    tempo: options.tempo
  })
}

const writetoSomaRc = (rcPath, data) => {
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

const createScore = () => {
  try {
    // const score = path.join(process.cwd(), `/score.json`)
    // fs.openSync(score, 'a')
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

export const init = options => {
  const cwd = process.cwd()
  const somarc = path.join(cwd, '/somarc.json')
  try {
    if (fs.existsSync(somarc)) {
      console.log('SOMA Project already initialized.')
    } else {
      createScore()
      createSomaRc(somarc, options)

      shell.mkdir('-p', `${cwd}/ly`)
      shell.mkdir('-p', `${cwd}/pdf`)
      shell.mkdir('-p', `${cwd}/midi`)
    }
  } catch (err) {
    console.error(err)
  }
}

export const output = (input, outputDir) => {
  const time = timeStamp()
  const lilypond = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond'

  fs.writeFileSync(`${cache}/${time}.ly`, printLilyPond(input), err => {
    if (err) throw err
  })

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
