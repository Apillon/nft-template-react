import { useEffect, useMemo, useState } from 'react';
import type { Events } from '@apillon/wallet-sdk';
import { useWallet } from '@apillon/wallet-react';
import { useWeb3Context } from './context/Web3Context';
import { useContract } from './hooks/useContract';
import { useWalletConnect } from './hooks/useWalletConnect';
import { useNft } from './hooks/useNft';
import Btn from './components/Btn';
import NftGallery from './components/Nft/NftGallery';
import CollectionInfo from './components/CollectionInfo';
import WalletConnect from './components/WalletConnect';
import Spinner from './components/Spinner';
import { toast } from 'react-toastify';

function App() {
  const { collectionInfo, filterByAddress, loadingNfts, nfts, myNftIDs } = useWeb3Context();
  const { loadCollectionInfo } = useContract();
  const { wallet } = useWallet();
  const { connected } = useWalletConnect();
  const { getNfts, showNfts, showMyNfts } = useNft();
  const [myNfts, setMyNfts] = useState(false);

  const filteredNfts = useMemo(() => {
    if (!filterByAddress) {
      return Object.values(nfts);
    }
    return Object.values(nfts).filter((nft) => myNftIDs.includes(nft.id));
  }, [nfts, filterByAddress]);

  useEffect(() => {
    loadCollectionInfo();
  }, []);

  useEffect(() => {
    if (connected) {
      getNfts();
      loadCollectionInfo();
    }
  }, [connected]);

  useEffect(() => {
    if (myNfts) {
      showMyNfts();
    } else {
      showNfts();
    }
  }, [myNfts]);

  useEffect(() => {
    if (wallet?.events) {
      wallet.events.on('addTokenStatus', ({ success }: Events['addTokenStatus']) => {
        success
          ? toast.success(`NFT successfully imported into the wallet!`)
          : toast.info('If you want to import NFT to wallet, paste contract address and token ID into your wallet.');
      });
    }
  }, [wallet]);

  return (
    <div>
      <div className='relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl bg-white p-8 text-center mobile:pt-14'>
        <CollectionInfo />

        <div className='absolute right-[10px] top-[10px] flex flex-col items-end'>
          <WalletConnect />
        </div>
      </div>

      {connected && collectionInfo?.name && (
        <div className='mb-6'>
          <h2 className='text-center'>Show NFTs:</h2>
          <div className='flex justify-center items-center gap-2'>
            <Btn loading={loadingNfts && !filterByAddress} disabled={false} onClick={() => setMyNfts(false)}>
              All nfts
            </Btn>
            <Btn loading={loadingNfts && filterByAddress} disabled={false} onClick={() => setMyNfts(true)}>
              My nfts
            </Btn>
          </div>
        </div>
      )}

      {connected && (
        <div>
          {(() => {
            if (loadingNfts) {
              return <Spinner />;
            } else if (Number(collectionInfo.totalSupply) === 0) {
              return <h2 className='text-center'>No NFTs, they must be minted first.</h2>;
            } else if (filterByAddress && !filteredNfts.length) {
              return <h2 className='text-center'>You don`t have any NFTs</h2>;
            } else if (!filteredNfts.length) {
              return <h2 className='text-center'>No NFTs, they must be minted first.</h2>;
            } else {
              return <NftGallery nfts={filteredNfts} />;
            }
          })()}
        </div>
      )}
    </div>
  );
}

export default App;
