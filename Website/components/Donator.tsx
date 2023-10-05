'use client'
import styles from '@/app/page.module.css';
import { ethers } from 'ethers';
import { createContract, roundBigIntString } from '@/utils/scripts';
import { useEffect, useState } from "react";

const Donator = ({address}: {address: string}) => {
  const [personnalBalance, setPersonnalBalance] = useState("0.000");
  const [amount, setAmount] = useState("0.001");

  const retreiveBalance = async () => {
    const tossACoin = await createContract(address);
    
    if (tossACoin) {
      const balanceString = ethers.formatEther(await tossACoin.tossed(address)); // string - 18 decimal
      setPersonnalBalance(roundBigIntString(balanceString, 3));
    }
  }

  const toss = async () => {
    const tossACoin = await createContract(address);
    
    if (tossACoin) {
      try {
        const bigIntAmount = ethers.parseEther(amount);
        if (bigIntAmount > 0)
          await tossACoin.toss({value: bigIntAmount});
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    if (address.length < 1)
      return;
    retreiveBalance();
  }, [address]);

  return (
    <div className={styles.donatorContainer}>
      <p>You already gave: {personnalBalance} ETH</p>
      <div className={styles.inputBare}>
      <input placeholder="0.001" value={amount} onChange={e => setAmount(e.target.value)}/>
      <button onClick={toss}>Toss</button>
      </div>
    </div>
  );
}

export default Donator;