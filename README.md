# truffle-plugin-modularizer

Truffle plugin to export built contract artifacts as a Javascript module

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![npm](https://img.shields.io/npm/v/truffle-plugin-modularizer/latest.svg)](https://www.npmjs.com/package/merklux)
[![Build Status](https://travis-ci.org/wanseob/truffle-plugin-modularizer.svg?branch=master)](https://travis-ci.org/wanseob/truffle-plugin-modularizer)

# Motivation

When we make a DApp, we usually use truffle and ReactJS or VueJS together. But to integrate the front-end with the truffle contracts, we had to integrate the repositories also. Because integrating contracts & front-end app in a repository increases complexity, it might be better to seperate them. Therefore, this library offers a easy way to package and publish the smart contracts on the npm library, and then you can easily use the contracts with truffle-contract instance in a seperated ReactJS or VueJS application. 

**Now, let's import truffle projects into NodeJS applications more easily**

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
    // artifacts: 'build/contracts'
  },
  ...
}
```
#### **Step 3: Build contracts and run modularize**

```
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
// FILE: App.js
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
    // const yourContract = await YourContract(web3Provider).default()
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

You can read the test cases [here](test/modularizer.test.js)
