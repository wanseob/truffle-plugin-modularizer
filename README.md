# truffle-plugin-modularizer

Truffle plugin to export built contract artifacts as a Javascript module 

# Motivation

When we make a DApp, we usually use truffle and ReactJS or VueJS together. But to integrate the front-end with the truffle contracts, we had to integrate the repositories also. Because integrating contracts & front-end app in a repository increases complexity, it might be better to seperate them. Therefore, this library offers a easy way to package and publish the smart contracts on the npm library, and then you can easily use the contracts with truffle-contract instance in a seperated ReactJS or VueJS applications. 

# How to use (from scratch)

**Step 1: Start your truffle project**

Your project might have following project structure
```bash
$ npm install -g truffle # Skip if you already have truffle binary
$ truffle init
$ tree -L 1
.
├── contracts
├── migrations
├── test
└── truffle-config.js
```

**Step 2: Configure *package.json* file**

If you don't have *package.json*, run `npm init` and set your entrypoint to contracts.js
```json
{
  "name": "your-project-name",
  ...
  "main": "contracts.js"
}
```
Or when you have your own entry point like *index.js*,
```javascript
/** index.js */
const { contracts } = require('./contracts')
module.exports = {
  ...,
  contracts
}
```

**Step 3: Install `truffle-plugin-modularizer` plugin**

```bash
$ npm install --save-dev truffle-plugin-modularizer
```

**Step 4: Build contracts and run modularize, then publish**

```
$ truffle compile
$ truffle run modularize
$ npm run publish
```

**Step 5: Use your deployed package in your ReactJS applicaton**

```
$ cd /your/react/app/path
$ npm install --save "your-project-name"
```

**Step 6: Import contracts into your front-end application and init with web3 provider**

```jsx
// FILE: App.js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Web3 from 'web3';
import { YourContract } from 'your-project-name'
...
const web3Provider = web3.currentProvider()


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
