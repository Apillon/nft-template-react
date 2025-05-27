export default function NftCard({ nft }: { nft: Nft }) {
  return (
    <>
      <div className='nft'>
        <img src={nft.image} className='object-contain' alt={nft.name} />
        <div className='pt-4 px-6 pb-6'>
          <h3>
            #{nft.id} {nft.name}
          </h3>
          <p>{nft.description}</p>
        </div>
      </div>
    </>
  );
}
