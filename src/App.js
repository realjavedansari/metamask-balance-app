import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        
        // Get the current account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        
        // Get the balance
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        setBalance(balanceEth);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
          updateBalance(web3, newAccounts[0]);
        });
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const updateBalance = async (web3, account) => {
    const balanceWei = await web3.eth.getBalance(account);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    setBalance(balanceEth);
  };

  return (
    <div className="App">
      <h1>MetaMask Connection</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      ) : (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
    </div>
  );
}

export default App;