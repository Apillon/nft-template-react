import { useAccount as useAccountEW, useWallet } from '@apillon/wallet-react';
import { useAccount, useChainId, useChains, useDisconnect, useSwitchChain, useSignMessage } from 'wagmi';
import { useMemo } from 'react';
import { CHAIN_ID } from '../lib/config';

export function useWalletConnect() {
  const { info } = useAccountEW();
  const { wallet, signMessage: signEW } = useWallet();

  const chains = useChains();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const network = useMemo(() => chains.find((c) => c.id === CHAIN_ID), [chains]);
  const connected = useMemo(() => isConnected || !!info.activeWallet?.address, [isConnected, info]);
  const walletAddress = useMemo(() => {
    return isConnected ? address : info.activeWallet?.address;
  }, [isConnected, address, info]);

  const sign = async (message: string) => {
    return isConnected ? await signMessageAsync({ message }) : await signEW(message);
  };

  const ensureCorrectNetwork = async () => {
    if (chainId !== CHAIN_ID) {
      await switchChain({ chainId: CHAIN_ID });
    }
    return true;
  };

  const disconnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else if (wallet && info.activeWallet?.address) {
      (wallet.events.emit as (event: string, ...args: any[]) => void)("disconnect");
    }
  };

  return {
    connected,
    network,
    walletAddress,
    disconnectWallet,
    ensureCorrectNetwork,
    sign,
  };
}
