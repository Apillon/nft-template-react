import NftCard from './NftCard';

export default function NftGallery({ nfts }: { nfts: Nft[] }) {
  return (
    <div className='relative'>
      <div className='grid grid-cols-nft gap-8'>
        {nfts.map((nft) => {
          return <NftCard key={nft.id} nft={nft} />;
        })}
      </div>
    </div>
  );
}
