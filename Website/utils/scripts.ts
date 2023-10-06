import { ethers } from 'ethers';
import contractABI from '@/abi/TossACoin.json';
import { Notify } from 'notiflix';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOSS_A_COIN_ADDRESS || "";

// function to create a contract ethers.js of tossACoin
export async function createContract(walletAddress: string) {
  if (walletAddress.length < 1)
    return undefined;
  try {
    const ethereum = window.ethereum;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner(walletAddress);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    return contract;
  } catch (e) {
    console.log(e);
    Notify.failure("An error occured");
    return undefined;
  }
}

export function roundBigIntString(number: string, roundedDecimal: number) {
  try {
    const balanceFloat = parseFloat(number);
    const roundedBalanceFloat = parseFloat(balanceFloat.toFixed(roundedDecimal));
    return roundedBalanceFloat.toString();
  } catch (e) {
    console.log(e);
    return "0.000";
  }
}