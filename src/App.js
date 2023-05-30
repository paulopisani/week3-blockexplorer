import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';


import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockHash, setBlockHash] = useState();
  //const [] = useState();
  const [blockTransactions, setBlockTransactions] = useState();
  const [blockTimestamp, setBlockTimestamp] = useState();

  useEffect(async () => {
    const block = await alchemy.core.getBlock(blockNumber);
    
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    
    async function getBlockHash() {
     // console.log('#############', block);
      setBlockHash(block.hash.toString().slice(0,10));
    }  

    async function getBlockTransactions() {
      setBlockTransactions((block.transactions).toString().slice(0,10));
    }  

    async function getBlockTimestamp() {
      setBlockTimestamp(block.timestamp);
    }  

    getBlockNumber();
    getBlockHash();
    getBlockTransactions();
    getBlockTimestamp();
   // console.log('***********************',blockHash)

  });

  //return <div className="App">Block Number: {blockNumber}</div><div className="App">Block Info: {blockInfo}</div> ;
  return (
    <div className="App">
        <h1> Block Number: {blockNumber} </h1>
        <h2> Block Hash: {blockHash}... </h2>
        <h3> Block Transactions: {blockTransactions}...</h3>
        <h4> Block Timestamp: {blockTimestamp}</h4>
      </div> 
  );
}

export default App;
