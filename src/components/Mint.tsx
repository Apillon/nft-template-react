import { useState } from 'react';
import { toast } from 'react-toastify';
import { createPublicClient, http } from 'viem';
import { useWeb3Context } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import { useNft } from '../hooks/useNft';
import { useWalletConnect } from '../hooks/useWalletConnect';
import Spinner from './Spinner';
import { transactionError } from '../lib/utils/errors';
import { checkInputAmount } from '../lib/utils';

export default function Mint() {
  const { collectionInfo } = useWeb3Context();
  const { mintToken, getBalance, getTotalSupply } = useContract();
  const { addNftId, addtMyNftIDs, fetchNft } = useNft();
  const { network } = useWalletConnect();

  const [amount, setAmount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const publicClient = createPublicClient({
    chain: network,
    transport: http(),
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value) || 1);
  };

  const mint = async () => {
    if (!checkInputAmount(amount)) {
      toast.warning('Wrong amount, please enter number between 1 and 5.');
      return;
    }

    setLoading(true);
    try {
      const tx = await mintToken(BigInt(collectionInfo.price), amount);
      if (!tx) {
        toast.error('Mint failed, please try again!');
        setLoading(false);
        return;
      }

      toast.info('NFT minting has started');

      const receipt: any = await publicClient.waitForTransactionReceipt({ hash: tx });
      toast.success('NFT has been successfully minted');

      const logs = receipt?.logs || receipt.data?.logs;
      if (logs && logs[0]?.topics[3]) {
        const nftId = Number(logs[0].topics[3]);

        setTimeout(() => onNftMinted(nftId), 1000);
      } else {
        toast.error('Mint failed, please check status of transaction on contract!');
      }
    } catch (e) {
      console.error(e);
      transactionError('Unsuccessful mint', e);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const onNftMinted = async (nftId: number) => {
    addtMyNftIDs(nftId);
    getBalance();
    getTotalSupply();
    const metadata = await fetchNft(nftId);
    if (metadata) {
      addNftId(nftId, metadata);
    }
  };

  return (
    <div className='mint'>
      <div className='amount'>
        <label htmlFor='amount'>Number of tokens (1-5):</label>
        <input type='number' min='1' max='5' value={amount} onChange={() => handleChange} />
      </div>
      <button className='btn btn-mint' onClick={() => mint()}>
        {loading ? <Spinner /> : 'Mint'}
      </button>
    </div>
  );
}
