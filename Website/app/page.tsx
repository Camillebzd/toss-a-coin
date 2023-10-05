'use client'
import ConnectButton from '@/components/ConnectButton'
import styles from './page.module.css'
import { useState } from "react";
import TotalCollected from '@/components/TotalCollected';
import Donator from '@/components/Donator';

export default function Home() {
  const [address, setAddress] = useState("");

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Toss a Coin
        </p>
        <ConnectButton address={address} setAddress={setAddress}/>
      </div>

      <div className={styles.coinContainer}>
        <div className={styles.coin}></div>
      </div>

      <TotalCollected address={address} />

      <Donator address={address} />
    </main>
  )
}
