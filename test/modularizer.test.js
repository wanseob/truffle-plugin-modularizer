const Web3 = require('web3')
const chai = require('chai')
chai.use(require('chai-bignumber')()).should()

const { SampleContract } = require('../sample-truffle/src/index')
const web3Provider = new Web3.providers.HttpProvider('http://localhost:8777')
const web3 = new Web3(web3Provider)

describe('truffle-plugin-modularizer', () => {
  let accounts
  before(async () => {
    accounts = await web3.eth.getAccounts()
  })
  describe('SampleContract(web3Provider).deployed()', () => {
    it('should be able to use deployed contract', async () => {
      let sampleContract = await SampleContract(web3Provider).deployed()
      await sampleContract.add(10, { from: accounts[0] })
      await sampleContract.add(20, { from: accounts[0] })
      await sampleContract.add(30, { from: accounts[0] })
      let values = await sampleContract.getValues()
      values[0].toNumber().should.equal(10)
      values[1].toNumber().should.equal(20)
      values[2].toNumber().should.equal(30)
    })
  })
  describe('SampleContract(web3Provider).new()', () => {
    it('should be able to deploy a new contract', async () => {
      let sampleContract = await SampleContract(web3Provider).new(
        { from: accounts[0] }
      )
      await sampleContract.add(10, { from: accounts[0] })
      await sampleContract.add(20, { from: accounts[0] })
      await sampleContract.add(30, { from: accounts[0] })
      let values = await sampleContract.getValues()
      values[0].toNumber().should.equal(10)
      values[1].toNumber().should.equal(20)
      values[2].toNumber().should.equal(30)
    })
  })
  describe('SampleContract(web3Provider).at()', () => {
    it('should be able to access to a contract with its address', async () => {
      let sampleContract = await SampleContract(web3Provider).deployed()
      let targetAddress = sampleContract.address
      sampleContract = await SampleContract(web3Provider).at(targetAddress)
      await sampleContract.add(10, { from: accounts[0] })
      await sampleContract.add(20, { from: accounts[0] })
      await sampleContract.add(30, { from: accounts[0] })
      let values = await sampleContract.getValues()
      values[0].toNumber().should.equal(10)
      values[1].toNumber().should.equal(20)
      values[2].toNumber().should.equal(30)
    })
  })
})
