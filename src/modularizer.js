const fs = require('fs')
const path = require('path')
const standard = require('standard')
const javascriptStringify = require('javascript-stringify')

/**
 * It makes a script with factory pattern to return truffle-contract instance
 */
const toFactoryScript = (contractName) => {
  return `${contractName}: function(web3Provider = undefined) {
            const contract = truffleContract(artifacts.${contractName})
            contract.setProvider(web3Provider)
            return contract
    }`
}

const modularize = (targetPath, outputPath, includesOnly) => {
  // Read contract file names. Usually ContractName.json in build/contracts
  const contracts = fs.readdirSync(targetPath)

  let artifacts = {}
  for (let contract of contracts) {
    // Get contract name removing the file extension  ".json"
    let contractName = contract.slice(0, -5)

    // Pass when if includesOnly is defined and it does not include this contract
    if (includesOnly && !includesOnly.includes(contractName)) continue

    // Objectify json file
    let obj = JSON.parse(fs.readFileSync(`${targetPath}/${contract}`, 'utf8'))

    // Remove properties which are dependent on local env
    delete obj.sourcePath
    delete obj.ast.absolutePath
    delete obj.legacyAST.absolutePath
    delete obj.updatedAt

    // Add the contract object into the artifacts object
    artifacts[contractName] = obj
  }

  return new Promise((resolve, reject) => {
    const module = `"use strict"
      
    const truffleContract = require('truffle-contract')
    const artifacts = ${javascriptStringify(artifacts)}
      
    module.exports = {
      ${Object.keys(artifacts).map(toFactoryScript).join(',')}
    }
    `
    // It makes the script prettier with standardJS style
    const lintResult = standard.lintTextSync(module, { fix: true })

    // Make directory if it does not exist
    fs.mkdir(path.dirname(outputPath), { recursive: true }, (err) => {
      if (err) reject(err)
    })

    // Write a script
    fs.writeFile(outputPath, lintResult.results[0].output, function (err) {
      if (err) {
        return reject(err)
      }
      console.log('Successfully modularize contracts')
      resolve()
    })
  })
}

module.exports = {
  modularize
}
