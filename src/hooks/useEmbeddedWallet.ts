import { useAccount, useWallet, useContract } from '@apillon/wallet-react';
import { encodeFunctionData } from 'viem';
import { moonbaseAlpha } from 'viem/chains';
import { useWalletConnect } from './useWalletConnect';
import {  CONTRACT_ADDRESS } from '../lib/config'
import nftAbi from '../lib/nftAbi';

export function useEmbeddedWallet() {
  const { info } = useAccount();
  const { wallet } = useWallet();
  const { network } = useWalletConnect();

  const { read } = useContract({
    abi: nftAbi,
    address: CONTRACT_ADDRESS,
    chainId: Number(network?.id || moonbaseAlpha.id),
    broadcast: true,
  });

  const getContractBalance = async () => {
    return await read('balanceOf', [info.activeWallet?.address]);
  };

  const mintEW = async (args: any[], value: bigint, gasLimit: bigint) => {
    const chainId = Number(network?.id || moonbaseAlpha.id);

    const signedTx = await wallet?.signPlainTransaction({
      mustConfirm: true,
      tx: {
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({ abi: nftAbi, functionName: 'mint', args }),
        gasLimit,
        value,
        chainId,
      },
    });

    if (signedTx?.signedTxData) {
      const tx = await wallet?.broadcastTransaction(signedTx.signedTxData, chainId);
      return tx?.txHash;
    }
    return null;
  };

  return { getContractBalance, mintEW };
}