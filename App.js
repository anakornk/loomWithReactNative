/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent,
  Contract, Address, LocalAddress, CryptoUtils
} from 'loom-js';
import { MapEntry } from './helloworld_pb';
import Web3 from 'web3';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      value: "test",
      account: ""
    };
  }
  componentDidMount() {
    var that = this;
    (async function () {
      const privateKey = CryptoUtils.generatePrivateKey()
      const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
      // console.log(privateKey);
      const contract = await getContract(privateKey, publicKey)
      await store(contract, '123', 'hello!')
      const value = await load(contract, '123')
      console.log('Value: ' + value)
      that.setState({
        value
      })
    })();

    this.web3  = new Web3('ws://localhost:8545');
    this.web3.eth.getBlock('latest').then(console.log).catch(console.log);
    this.web3.eth.getAccounts(function(error,res) {
      if(!error) {
        console.log(res);
        that.setState({account: res[0]})
      } else {
        console.log(error);
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text>{this.state.value}</Text>
        <Text>{this.state.account}</Text>
      </View>
    );
  }
}

// LOOM
async function getContract(privateKey, publicKey) {
  const client = new Client(
    'default',
    'ws://127.0.0.1:46657/websocket',
    'ws://127.0.0.1:9999/queryws'
  )

  client.on(ClientEvent.Error, err => console.log(err || 'Unexpected Client Error'))

  // required middleware
  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]
  
  const contractAddr = await client.getContractAddressAsync('BluePrint')
    if (!contractAddr) {
      throw new Error('Failed to resolve contract address')
  }
  const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
  return new Contract({
    contractAddr,
    callerAddr,
    client
  })
}

/**
 * Stores an association between a key and a value in a smart contract.
 * @param contract Contract instance returned from `getContract()`.
 */
async function store(contract, key, value) {
  const params = new MapEntry()
  params.setKey(key)
  params.setValue(value)
  await contract.callAsync('SetMsg', params)
}

/**
 * Loads the value associated with a key in a smart contract.
 * @param contract Contract instance returned from `getContract()`.
 */
async function load(contract, key) {
  const params = new MapEntry()
  // The smart contract will look up the value stored under this key.
  params.setKey(key)
  const result = await contract.staticCallAsync('GetMsg', params, new MapEntry())
  return result.getValue()
}


// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
