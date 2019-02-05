module.exports = {
  networks: {
    test: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8777, // Standard Ethereum port (default: none)
      network_id: '1243' // Any network (default: none)
    }
  },
  modularizer: {
    // output: 'src/index.js',
    // target: 'build/contracts',
    // includeOnly: [
    //   'SampleContract',
    // ],
  },
  plugins: [
    'truffle-plugin-modularizer'
  ]
}
