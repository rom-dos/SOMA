const fs = require('fs')
const harmonicSets = require('./harmonicSets')
const utils = require('./utils.js')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const output = (input) => {
  fs.writeFile('../output/runtime081018.ly', utils.printLilyPond(input), err => {
    if (err) throw err

    console.log('Success! Check the output directory')
  })
}

console.log(`
Welcome to System of Musical Architecture (SOMA)
Version: 0.0.3 
Author: ROM-DOS`)

rl.question(`
Please select one of the options below to get started:

[1] Print Scales

Enter your choice: `, (selection) => {
  switch (selection) {
    case '1':
      console.log('You\'ve selected to print scales')
      rl.question(`
    Select a scale type:

    [Major] Major
    [Minor] Minor

    Enter your choice: `, (selection) => {
        output(utils.playScale(harmonicSets[selection]['c'][1]))
        rl.close()
      })
      break
    default:
      break
  }
})
