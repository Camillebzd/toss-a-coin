'use client'
import styles from '@/app/page.module.css';
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Notify } from 'notiflix';

// TODO declare this somewhere else
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum:MetaMaskInpageProvider
  }
}

const GOOD_NETWORK_ID = process.env.NEXT_PUBLIC_GOOD_NETWORK_ID || 0;

const ConnectButton = ({address, setAddress, isOnGoodNetwork, setIsOnGoodNetwork}: 
{address: string, setAddress: Dispatch<SetStateAction<string>>, isOnGoodNetwork: boolean, 
setIsOnGoodNetwork: Dispatch<SetStateAction<boolean>>}) => {
  useEffect(() => {
    if (window?.ethereum === undefined) {
      console.log("Error: not metamask detected");
      Notify.failure("Install metamask if you want to use the site")
      return;
    }
    const checkAccounts = async () => {
      const accounts = await window.ethereum.request<String[]>({method: 'eth_accounts'});       
      if (accounts?.length) {
        // set wallet
        console.log("Connected with: ", accounts[0]);
        Notify.success("Account connected");
        setAddress(accounts[0] as string);
        await switchChain();
      }
    }
    const handleAccountChanged = (accounts: any) => {
      if (accounts.length > 0) {
        console.log(`Account connected: ${accounts[0]}`); 
        // set wallet
        setAddress(accounts[0] as string);
        Notify.success("Account connected");
      }
      else {
        console.log("Account disconnected");
        // unset wallet
        setAddress("" as string);
        Notify.success("Account disconnected");
      }
    };
    const handleChainChanged = (networkId: any) => {
      if (networkId == GOOD_NETWORK_ID)
        setIsOnGoodNetwork(true);
      else
        setIsOnGoodNetwork(false);
    };
    window.ethereum.on("accountsChanged", handleAccountChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    checkAccounts();
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
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
      if (window.ethereum.chainId == GOOD_NETWORK_ID)
        setIsOnGoodNetwork(true);
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if ((switchError as any).code === 4902) {
        Notify.failure("Error: you don't have sepolia network added");
        console.log("Error: you don't have the good network added.");
      }
      // handle other "switch" errors
    }
  };

  const connect = async () => {
    if (typeof window.ethereum === undefined) {
      console.log("Error: not metamask detected");
      Notify.failure("Error: install metamask before using the site");
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
    await switchChain();
  }

  const showButton = () => {
    if (address.length > 0 && isOnGoodNetwork) {
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