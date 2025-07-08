import { useEffect, useState } from 'react';
import { useAccount, useConnect, useChains } from 'wagmi';
import { type Network } from '@apillon/wallet-sdk';
import { EmbeddedWallet, useWallet } from '@apillon/wallet-react';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { EMBEDDED_WALLET_CLIENT } from '../lib/config';
import { shortHash } from '../lib/strings';
import Modal from 'react-modal';
import Btn from './Btn';
import scrollLock from '../lib/utils/scroll-lock';

export default function WalletConnect() {
  const chains = useChains();
  const { wallet } = useWallet();
  const { connect, connectors } = useConnect();
  const { connected, network, walletAddress, disconnectWallet } = useWalletConnect();
  const { isConnecting, isConnected, connector } = useAccount();

  const [connectorName, setConnectorName] = useState<string>('');
  const [modalWalletVisible, setModalWalletVisible] = useState(false);

  const networks = chains.map((chain) => ({
    name: chain.name,
    id: chain.id,
    rpcUrl: chain.rpcUrls.default.http[0]||'',
    explorerUrl: chain.blockExplorers?.default?.url||'',
  } as Network));

  function openModal() {
    scrollLock.enable();
    setModalWalletVisible(true);
  }
  function closeModal() {
    setModalWalletVisible(false);
    scrollLock.disable();
  }

  function openWallet() {
    wallet?.events.emit('open', true);
    closeModal();
  }

  function closeWallet() {
    wallet?.events.emit('open', false);
    closeModal();
  }

  const connectWallet = (conn: (typeof connectors)[number]) => {
    if (isConnected && conn.type === connector?.type) {
      console.debug('Already connected to this wallet');
      return;
    }
    setConnectorName(conn.name);
    connect({ connector: conn });
  };
  
  const  disconnect =() => {
    if (isConnected) {
      disconnectWallet();
    } else if (wallet) {
      wallet.events.emit('open', true);
    }
  }

  useEffect(() => {
    if (isConnected) closeWallet();
  }, [isConnected]);

  return (
    <>
      {connected ? (
        <div className='flex items-center justify-end gap-2'>
          {walletAddress && <strong>({shortHash(walletAddress)})</strong>}
          <Btn
            className='w-auto'
            variant='secondary'
            disabled={false}
            loading={false}
            onClick={() => disconnect()}
          >
            Disconnect
          </Btn>
        </div>
      ) : (
        <Btn className='w-auto rounded-full' disabled={false} loading={modalWalletVisible} onClick={openModal}>
          Connect Wallet
        </Btn>
      )}

      {EMBEDDED_WALLET_CLIENT && network && (
        <EmbeddedWallet
          clientId={EMBEDDED_WALLET_CLIENT}
          passkeyAuthMode='popup'
          defaultNetworkId={network.id}
          networks={networks}
        />
      )}

      <Modal
        className='fixed bg-bg max-w-xl w-full mx-auto rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        ariaHideApp={false}
        isOpen={modalWalletVisible}
        onRequestClose={() => closeModal()}
      >
        <button className="btn-modal-exit" onClick={() => closeModal()}></button>
        <div className='mx-auto my-12 w-full max-w-md text-center px-4 md:px-6'>
          <h2 className="my-4">Your NFTs, delivered with style</h2>
          <p>Email them. Airdrop them. Share a link. <br />No gas fees. No fuss.</p>

          <hr className='my-6 border-gray-300 dark:border-zinc-700' />
          <h4 className='my-4 text-lg font-medium'>Connect your wallet to get started:</h4>

          <div className='flex flex-col gap-2'>
            {EMBEDDED_WALLET_CLIENT && (
              <Btn variant='secondary' disabled={false} loading={false} onClick={openWallet}>
                <span className='mr-1'>▶◀</span> Apillon Embedded Wallet
              </Btn>
            )}
            {connectors.map((c, idx) => (
              <Btn
                key={idx}
                variant='secondary'
                size='lg'
                disabled={isConnecting && connectorName === c.name}
                loading={isConnecting && connectorName === c.name}
                onClick={() => connectWallet(c)}
              >
                <span className='inline-flex items-center gap-2'>
                  <img
                    src={`/images/wallet/${c.id}.svg`}
                    alt={c.name}
                    className='mr-2 w-5 h-5'
                    width={20}
                    height={20}
                  />
                  <span>{c.name}</span>
                </span>
              </Btn>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
