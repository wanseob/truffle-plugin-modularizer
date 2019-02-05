const path = require('path')

const assertString = (param, message) => {
  if (param && typeof param !== 'string') { throw Error(`AssertionError: ${message}`) }
}

const assertBool = (param, message) => {
  if (param && typeof param !== 'boolean') { throw Error(`AssertionError: ${message}`) }
}

/**
 * This parses truffle config from cli arguments and truffle-config.js
 * @param config Truffle config object
 * @return {{targetPath: string, outputPath: string, includesOnly: *}}
 */
const parse = (config) => {
  // -t, --target    Path to read built artifacts of contracts. default path is 'build/contracts
  assertString(config.target, '--target should have string argument')
  assertString(config.t, '-t should have string argument')

  // -o, --output    Path to write modularized js file. default path is src/index.js
  assertString(config.output, '--output should have string argument')
  assertString(config.o, '-o should have string argument')

  // -a, --all       It will modularize all contracts
  assertBool(config.all, '--all should have no argument')

  // Get the path of target artifacts
  let targetPath, outputPath, includesOnly

  // Parse targetPath
  if (config.target || config.t) {
    // cli options are first
    targetPath = config.target ? config.target : config.t
  } else if (config.modularizer && config.modularizer.target) {
    // if there's no cli option, check truffle-config.js
    targetPath = path.join(config.working_directory, config.modularizer.target)
  } else if (config.contracts_build_directory) {
    // if there's default contracts_build_directory configuration
    targetPath = path.join(config.contracts_build_directory)
  } else {
    // default setting
    targetPath = path.join(config.working_directory, 'build', 'contracts')
  }

  // Parse outputPath
  if (config.output || config.o) {
    // cli options are first
    outputPath = config.output ? config.output : config.o
  } else if (config.modularizer && config.modularizer.output) {
    // if there's no cli option, check truffle-config.js
    outputPath = path.join(config.working_directory, config.modularizer.output)
  } else {
    // default setting
    outputPath = path.join(config.working_directory, 'src', 'index.js')
  }

  // Parse includesOnly
  if (config.all) {
    // cli options are first, includes all contracts in the target dircetory
    includesOnly = undefined
  } else if (config._.length > 1) {
    // if there's no --all flag and it receives arguments from cli
    includesOnly = config._.slice(1)
  } else if (config.modularizer && config.modularizer.includesOnly) {
    // if there's no --all flag, and no args from cli, check truffle-config.js
    includesOnly = config.modularizer.includesOnly
  } else {
    // default setting, includes all
    includesOnly = undefined
  }
  return { targetPath, outputPath, includesOnly }
}

module.exports = {
  parse
}
