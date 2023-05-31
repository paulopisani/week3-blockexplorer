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

// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState('');


  //This useEffect hook runs once when the component is mounted.
  useEffect(() => {
    async function getBlockNumber() {
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlockNumber);
      } catch (error) {
        console.error('Error retrieving block number:', error);
      }
    }

    getBlockNumber();
  }, []);


  //whenever the blockNumber state variable changes thos useEffect will run
  useEffect(() => {
    async function getBlock() {
      if (blockNumber) {
        try {
          const blockData = await alchemy.core.getBlockWithTransactions(blockNumber);
          setBlock(blockData);
          setTransactions(blockData.transactions);
          setSelectedTransaction('');
        } catch (error) {
          console.error(`Error retrieving block ${blockNumber}:`, error);
        }
      }
    }

    getBlock();
  }, [blockNumber]);

  // that takes a txHash parameter. It retrieves the transaction receipt 
  // and sets the transaction state variable with the result
  async function getTransaction(txHash) {
    try {
      const transactionData = await alchemy.core.getTransactionReceipt(txHash);
      setSelectedTransaction(transactionData);
    } catch (error) {
      console.error('Error retrieving transaction:', error);
    }
  }

  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      {blockNumber && (
        <div>
          <h2>Current Block Number: {blockNumber}</h2>
          {block && (
            <div>
              <h3>Block Details</h3>
              <p>Block Hash: {block.hash}</p>
              <p>Block Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</p>
              <p>Number of Transactions: {block.transactions.length}</p>
              <h4>Transactions</h4>
              {transactions.length > 0 ? (
                <select value={selectedTransaction} onChange={(e) => getTransaction(e.target.value)}>
                  <option value="">Select a transaction</option>
                  {transactions.map((tx) => (
                    <option key={tx.hash} value={tx.hash}>
                      {tx.hash}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No transactions found in this block.</p>
              )}
            </div>
          )}
          {selectedTransaction && (
            <div>
              <h3>Transaction Details</h3>
              <p>Transaction Hash: {selectedTransaction.transactionHash}</p>
              <p>Block Number: {selectedTransaction.blockNumber}</p>
              <p>From: {selectedTransaction.from}</p>
              <p>To: {selectedTransaction.to}</p>
              <p>Value: {selectedTransaction.value}</p>
            </div>
          )}
        </div>
      )}
      {!blockNumber && <p>Loading...</p>}
    </div>
  );
}

export default App;
