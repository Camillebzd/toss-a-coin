'use client'
import styles from '@/app/page.module.css';
import { ethers } from 'ethers';
import { createContract, roundBigIntString } from '@/utils/scripts';
import { useEffect, useState } from "react";

const TotalCollected = ({address}: {address: string}) => {
  const [balance, setBalance] = useState("0.000");

  const retreiveBalance = async () => {
    const tossACoin = await createContract(address);
    
    if (tossACoin) {
      const balanceString = ethers.formatEther(await tossACoin.totalReceived()); // string - 18 decimal
      setBalance(roundBigIntString(balanceString, 3));
    }
  }

  useEffect(() => {
    if (address.length < 1)
      return;
    retreiveBalance();
  }, [address]);

  return (
    <div>
      <p style={{fontSize: "large"}}>Total collected: {balance} ETH</p>
    </div>
  );
}

export default TotalCollected;