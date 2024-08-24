import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check if already connected
      web3Instance.eth.getAccounts().then(handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
    } else {
      setAccount('');
      setBalance('');
    }
  };

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const disconnectFromMetaMask = async () => {
    setAccount('');
    setBalance('');
  };

  const updateBalance = async (account) => {
    if (web3 && account) {
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    }
  };

  return (
    <div className="App">
      <h1>MetaMask Connection</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={disconnectFromMetaMask}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
    </div>
  );
}

export default App;