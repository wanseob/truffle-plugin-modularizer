const fs = require('fs')
const path = require('path')
const standard = require('standard')
const javascriptStringify = require('javascript-stringify')

/**
 * It makes a script with factory pattern to return truffle-contract instance
 */
const toFactoryScript = (contractName) => {
  return `${contractName}: function(web3 = undefined) {
            return makeTruffleContract('${contractName}', web3)
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
    
    function makeTruffleContract(contractName, web3 = undefined) {
      const contract = truffleContract(artifacts[contractName])
      if(web3 && web3.constructor) {
        if(web3.constructor.name === 'Web3') {
          contract.setProvider(web3.currentProvider)
          contract.web3 = web3
        } else if (web3.constructor.name.includes('Provider') || typeof web3 === 'string') {
          // Backward compatibility
          process.emitWarning('It is recommended to use a Web3 instance instead of Web3Provider')
          contract.setProvider(web3)
        } else {
          throw Error('You should provide a valid web3 instance')
        }
      }
      return contract
    }
    
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
