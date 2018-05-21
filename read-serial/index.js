require('dotenv').load()

const { appendFile, writeFileSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')
const SerialPort = require('serialport')

const portName = process.env.PORT_NAME
const baudRate = process.env.BAUD_RATE || 57600
const filename = process.env.FILENAME || 'output.txt'

if (!portName) {
  console.log('You must specify a port name to use for serial communication')
  process.exit()
}

console.log('Setting up', {
  portName,
  baudRate,
  filename
})

const folderName = 'output'
const outputFolder = join(__dirname, folderName)
const outputDestination = join(outputFolder, filename)

if (!existsSync(outputFolder)) {
  mkdirSync(outputFolder)
  console.log(`Created output folder "${outputFolder}"`)
}

if (!existsSync(outputDestination)) {
  writeFileSync(outputDestination)
  console.log(`Created output file "${outputDestination}"`)
}

var port = new SerialPort(portName, { baudRate }, error => {
  if (error) {
    console.log('Failed to open port')
    throw error
  }

  console.log('Opened port')

  printToFile(`${new Date().toISOString()}\n`)
})

port.on('error', error => {
  console.log('Error from serialport', error)
})

port.on('data', data => {
  console.log(data)
  printToFile(data)
})

function printToFile(data) {
  appendFile(outputDestination, data, error => {
    if (error) {
      console.log('Failed to write data to file', error)
    }
  })
}