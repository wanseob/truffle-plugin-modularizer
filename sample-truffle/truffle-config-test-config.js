module.exports = {
  networks: {
    test: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8777, // Standard Ethereum port (default: none)
      network_id: '1243' // Any network (default: none)
    }
  },
  modularizer: {
    output: 'src/custom/index.js',
    target: 'build/custom/contracts',
    includeOnly: [
      'SampleContract'
    ],
    networks: [
      1243
    ]
  },
  contracts_build_directory: 'build/custom/contracts',
  plugins: [
    'truffle-plugin-modularizer'
  ]
}
