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

const modularize = (targetPath, outputPath, includeOnly, networks) => {
  // Read contract file names. Usually ContractName.json in build/contracts
  const contracts = fs.readdirSync(targetPath)

  let artifacts = {}
  for (let contract of contracts) {
    // Get contract name removing the file extension  ".json"
    let contractName = contract.slice(0, -5)

    // Pass when if includeOnly is defined and it does not include this contract
    if (includeOnly && !includeOnly.includes(contractName)) continue

    // Objectify json file
    let obj = JSON.parse(fs.readFileSync(`${targetPath}/${contract}`, 'utf8'))

    // Remove properties which are dependent on local env
    delete obj.sourcePath
    delete obj.ast.absolutePath
    delete obj.legacyAST.absolutePath
    delete obj.updatedAt

    // If networks configuration exists, only save the deployed addresses for the designated network ids
    if (networks) {
      obj.networks = Object.keys(obj.networks).reduce((result, networkId) => {
        if (networks.includes(networkId)) {
          result[networkId] = obj.networks[networkId]
        }
        return result
      }, {})
    }

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
    const scriptToWrite = lintResult.results[0].output

    // Check does it already exist, if then check the diff and decide to update or not
    try {
      const legacy = fs.readFileSync(outputPath, 'utf8')
      if (legacy === scriptToWrite) {
        console.log('truffle-plugin-modularizer: No updates')
        resolve()
        return
      }
    } catch (e) {}

    // Make directory if it does not exist
    fs.mkdir(path.dirname(outputPath), { recursive: true }, (err) => {
      if (err) reject(err)
      else {
        // Write a script after create the target directory
        fs.writeFile(outputPath, scriptToWrite, function (err) {
          if (err) {
            return reject(err)
          }
          console.log('truffle-plugin-modularizer: Successfully modularize contracts')
          resolve()
        })
      }
    })
  })
}

module.exports = {
  modularize
}
