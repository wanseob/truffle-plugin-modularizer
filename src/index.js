const { printManual } = require('./manual.js')
const { parse } = require('./parser.js')
const { modularize } = require('./modularizer.js')

/**
 * It modularize truffle project by packaging built artifacts into a javascript
 * module when running `truffle run modularize`,
 * You can specify the output path add output path to the truffle-config.js
 * @param {Config} config - A truffle-config object.
 * Has attributes like `truffle_directory`, `working_directory`, etc.
 */
module.exports = async (config) => {
  // Print manual for `truffle run modularize --help`
  if (config.help) {
    printManual()
    return
  }

  // Parse arguments
  let { targetPath, outputPath, includeOnly } = parse(config)

  // Modularize the contracts and write a JS file
  await modularize(targetPath, outputPath, includeOnly)
}
