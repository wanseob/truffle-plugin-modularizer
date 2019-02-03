const path = require('path')
const fs = require('fs')
const standard = require('standard')
const javascriptStringify = require('javascript-stringify')

/**
 * It modularize truffle project by packaging built artifacts into a javascript
 * module when running `truffle run modularize`,
 * You can specify the output path add output path to the truffle-config.js
 * @param {Config} config - A truffle-config object.
 * Has attributes like `truffle_directory`, `working_directory`, etc.
 */
module.exports = async (config) => {
  if (config.help) {
    console.log(`Usage: truffle run modularize [output]`)
    return
  }

  let artifactPath
  if (config.modularizer && config.modularizer.output) {
    artifactPath = path.join(config.working_directory,
      config.modularizer.artifacts)
  } else {
    artifactPath = path.join(config.working_directory, 'build', 'contracts')
  }

  let output
  if (config.modularizer && config.modularizer.output) {
    output = path.join(config.working_directory, config.modularizer.output)
  } else {
    output = path.join(config.working_directory, 'src', 'index.js')
  }

  const contracts = fs.readdirSync(artifactPath)
  let artifacts = {}
  for (let contract of contracts) {
    let obj = JSON.parse(fs.readFileSync(`${artifactPath}/${contract}`, 'utf8'))
    delete obj.sourcePath
    delete obj.ast.absolutePath
    delete obj.legacyAST.absolutePath
    delete obj.updatedAt
    artifacts[contract.slice(0, -5)] = obj
  }

  const writeFile = () => {
    return new Promise((resolve, reject) => {
      const module = `"use strict"
      
      const truffleContract = require('truffle-contract')
      const artifacts = ${javascriptStringify(artifacts)}
      
      module.exports = {
        ${Object.keys(artifacts).map((contractName) =>
    `${contractName}: function(web3Provider = undefined) {
            const contract = truffleContract(artifacts.${contractName})
            contract.setProvider(web3Provider)
            return contract
          }`).join(',')
}
      }
      `
      const lintResult = standard.lintTextSync(module, { fix: true })
      fs.mkdir(path.dirname(output), { recursive: true }, (err) => {
        if (err) reject(err)
      })

      fs.writeFile(output, lintResult.results[0].output, function (err) {
        if (err) {
          return reject(err)
        }
        console.log('Successfully modularize contracts')
        resolve()
      })
    })
  }
  await writeFile()
}
