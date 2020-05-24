import { createScore, createSomaRc } from '../utils/output-utils.js'

import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

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
