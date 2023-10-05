'use client'
import styles from '@/app/page.module.css';
import { useEffect, useState, Dispatch, SetStateAction } from "react";

// TODO declare this somewhere else
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum:MetaMaskInpageProvider
  }
}

const ConnectButton = ({address, setAddress}: {address: string, setAddress: Dispatch<SetStateAction<string>>}) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum === undefined) {
      console.log("Error: not metamask detected");
      return;
    }
    const checkAccounts = async () => {
      const accounts = await window.ethereum.request<String[]>({method: 'eth_accounts'});       
      if (accounts?.length) {
        // set wallet
        console.log("Connected with: ", accounts[0]);
        setAddress(accounts[0] as string);
        // await switchChain();
      }
    }
    const handleAccountChanged = (accounts: any) => {
      if (accounts.length > 0) {
        console.log(`Account connected: ${accounts[0]}`); 
        // set wallet
        setAddress(accounts[0] as string);
      }
      else {
        console.log("Account disconnected");
        // unset wallet
        setAddress("" as string);
      }
    };
    window.ethereum.on("accountsChanged", handleAccountChanged);
    checkAccounts();
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChanged);
    };
  }, []);

  const switchChain = async () => {
    if (typeof window.ethereum === undefined)
      return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as any).code === 4902) {
        console.log("Error: you don't have the good network added.");
      }
      // handle other "switch" errors
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === undefined) {
      console.log("Error: not metamask detected");
      return;
    }
    // connect
    try {
        await window.ethereum.request({method: "eth_requestAccounts"});
    } catch (e) {
      console.log(e);
      return;
    }
    // switch network
    // await switchChain();
  }

  const showButton = () => {
    if (address.length > 0) {
      return (
        <p>{address}</p>
        );
    } else {
      return (
        <button onClick={connect} className={styles.connectButton}>Connect wallet</button>
      );
    }
  }

  return (
    <div>
      {showButton()}
    </div>
  );
}

export default ConnectButton;