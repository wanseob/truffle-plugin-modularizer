# truffle-plugin-modularizer

Truffle plugin to export built contract artifacts as a Javascript module

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![npm](https://img.shields.io/npm/v/truffle-plugin-modularizer/latest.svg)](https://www.npmjs.com/package/merklux)
[![Build Status](https://travis-ci.org/wanseob/truffle-plugin-modularizer.svg?branch=master)](https://travis-ci.org/wanseob/truffle-plugin-modularizer)

# Motivation

When we make a DApp, we usually use truffle and ReactJS or VueJS together. But to integrate the front-end with the truffle contracts, we had to integrate the repositories also. Because integrating contracts & front-end app in a repository increases complexity, it might be better to seperate them. Therefore, this library offers a easy way to package and publish the smart contracts on the npm library, and then you can easily use the contracts with truffle-contract instance in a seperated ReactJS or VueJS application. 

**Now, let's import truffle projects into NodeJS applications more easily**

# Usage (after plugin setting)

```bash
$ truffle run modularize --help

Modularizer to export your truffle project as a node module

Usage: truffle run modularize [options] [CONTRACT_NAMES...]

If CONTRACT_NAMES is ommitted and there's no setting in truffle-config.js,
this will modularize all contracts in the built/contracts directory

Options:

   -o, --output <path>   Path to write modularized js file. default path is src/index.js'
   -t, --target <path>   Path to read built artifacts of contracts. default path is 'build/contracts'
   -a, --all             It will modularize all contracts

You can store your custom settings in truffle-config.js

{
  ...,
  modularizer:
    {
      output: "src/index.js",
      target: "build/contracts",
      includesOnly: [
        "FirstContractName",
        "SecondContractName"
      ]
    },
  ...
}
```

# How to use (from scratch)
 
#### **Step 1: Install plugin**

```bash
$ npm install --save-dev truffle-plugin-modularizer
```

#### **Step 2: Modify your *truffle-config.json* to configure plugin**

```javascript
// truffle-config.js
module.exports = {
  ...,
  plugins: [
    'truffle-plugin-modularizer'
  ],
  modularizer: {
    // output: 'src/index.js',
    // target: 'build/contracts'
    // includesOnly: []
  },
  ...
}
```
#### **Step 3: Build contracts and run modularize**

```bash
$ truffle compile
$ truffle migrate
$ truffle run modularize
```
This command generates *src/index.js* file.

#### **Step 4: Configure *package.json* file & publish**

If you don't have *package.json*, run `npm init` and set your entrypoint
```js
// package.json
{
  "name": "your-project-name",
  "main": "src/index.js",
  ...
}

$ npm publish
```

#### **Step 5: Use the deployed contract package in your ReactJS applicaton**

```
$ cd /your/react/app/path
$ npm install --save "your-project-name"
```

#### **Step 6: Import contracts into your front-end application and init with web3 provider**

```jsx
// ex: ReactJS, file: App.js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Web3 from 'web3';
import { YourContract } from 'your-project-name'

class App extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }
  async componentDidMount() {
    const web3Provider = web3.currentProvider // or use your custom web3 provider
    const yourContract = await YourContract(web3Provider).at("0xCONTRACT_ADDRESS") 
    // const yourContract = await YourContract(web3Provider).deployed()
    // const yourContract = await YourContract(web3Provider).new()
    const values = await yourContract.getValues() // Assue that this returns an BigNumber array
    this.setState({ values });
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.data.map(item => (
            <li>
              {item.toString()}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default App;
ReactDOM.render(<App />, document.getElementById("app"));
```

You can read the test cases [here](test/modularizer.default.js)

# Contribute

1. Fork & clone

    ```bash
    git clone https://github.com/{your-id}/truffle-plugin-modularizer
    ```

1. Install packages & run test cases

    ```bash
    npm install
    npm run test
    ```
    
1. Modify sample contracts & add some features

    ```bash
    vim src/index.js # entry point
    vim src/modualrizer.js # exports Contract.json files to js module
    vim src/parser.js # option parser
    vim src/manual.js # prints manual for this plugin
    vim sample-truffle/contracts/SampleContract.sol # Sample contract for testing
    ```
    
1. Add test cases for new features

    ```bash
    vim test/modularizer.default.js # test cases for default setup
    vim test/modularizer.config.js # test cases for truffle-config.js options
    vim test/modularizer.cli.js # test cases for cli options
    ```

1. Run test & commit (Read [conventional commit](https://www.conventionalcommits.org))
    
    Husky will automatically run linter & test cases 
    
    ```bash
    npm run test
    git add . && git commit -m "feat: add a new feature ~~"
    ```

# License

[Apache-2.0](#LICENSE)