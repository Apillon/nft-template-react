import { useAccount, useWallet, useContract } from '@apillon/wallet-react';
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

  const mintEW = async (args: any[], value: bigint) => {
    const label = 'Mint';
    const chainId = Number(network?.id || moonbaseAlpha.id);

    const signedTx = await wallet.evm.signContractWrite({
      contractAbi: nftAbi,
      contractAddress: CONTRACT_ADDRESS,
      contractFunctionName: 'mint',
      contractFunctionValues: args,
      contractTransactionValue: value,
      chainId,
      label,
      mustConfirm: true,
    });
    // PLAING TRANSACTION
    // const signedTx = await wallet?.evm.signPlainTransaction({
    //   mustConfirm: true,
    //   tx: {
    //     to: CONTRACT_ADDRESS,
    //     data: encodeFunctionData({ abi: nftAbi, functionName: 'mint', args }),
    //     gasLimit,
    //     value,
    //     chainId,
    //   },
    // });

    if(signedTx){
      const tx = await wallet.evm.broadcastTransaction(
        signedTx.signedTxData,
        signedTx.chainId,
        label
      )      
      return tx?.txHash;
    }
    return null;
  };

  return { getContractBalance, mintEW };
}