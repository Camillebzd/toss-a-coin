'use client'
import ConnectButton from '@/components/ConnectButton'
import styles from './page.module.css'
import { useState } from "react";
import TotalCollected from '@/components/TotalCollected';
import Donator from '@/components/Donator';

export default function Home() {
  const [address, setAddress] = useState("");
  const [isOnGoodNetwork, setIsOnGoodNetwork] = useState(false);

  const showBody = () => {
   if (address.length > 0 && isOnGoodNetwork) {
    return (
      <>
        <TotalCollected address={address} />
        <Donator address={address} />
      </>
    );
   } else {
    return (
      <div>
        <p style={{fontSize: 'large'}}>Connect your metamask on sepolia network to interact.</p>
      </div>
    );
   }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Toss a Coin - SEPOLIA
        </p>
        <ConnectButton address={address} setAddress={setAddress} isOnGoodNetwork={isOnGoodNetwork} setIsOnGoodNetwork={setIsOnGoodNetwork}/>
      </div>

      <div className={styles.coinContainer}>
        <div className={styles.coin}></div>
      </div>

      {showBody()}
    </main>
  )
}
