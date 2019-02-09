const chai = require('chai')
const truffleConfig = require('../sample-truffle/truffle-config')
chai.use(require('chai-bignumber')()).should()

const modularizedTruffleProject = require('../sample-truffle/src/custom/index')

describe('Test for truffle-config.js configuration', () => {
  context('truffle-config.js should have correct configurations', () => {
    it('output should be "src/custom/index.js"', () => {
      truffleConfig.modularizer.output.should.equal('src/custom/index.js')
    })
    it('contracts_build_directory should be "build/custom/contracts"',
      () => {
        truffleConfig.modularizer.target.should.equal('build/custom/contracts')
        truffleConfig.contracts_build_directory.should.equal('build/custom/contracts')
      })
    it('includeOnly should be ["SampleContract"]', () => {
      truffleConfig.modularizer
        .should.have.property('includeOnly')
        .with.lengthOf(1)
      truffleConfig.modularizer.includeOnly[0].should.equal('SampleContract')
    })
    it('networks should be [1243]', () => {
      truffleConfig.modularizer
        .should.have.property('networks')
        .with.lengthOf(1)
      truffleConfig.modularizer.networks[0].should.equal(1243)
    })
  })
  describe('src/custom/index.js', () => {
    it('Should not include Migrations function in the module', () => {
      modularizedTruffleProject.should.not.have.property('Migrations')
    })
    it('Should include SampleContract function in the module', () => {
      modularizedTruffleProject.should.have.property('SampleContract')
    })
    it('Should not include any network information', () => {
      Object.keys(modularizedTruffleProject.SampleContract('http://127.0.0.1:8777').networks).forEach(
        id => {
          truffleConfig.modularizer.networks.map(networkId => networkId.toString()).includes(id).should.equal(true)
        })
    })
  })
})
