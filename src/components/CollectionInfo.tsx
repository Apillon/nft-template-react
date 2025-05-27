import { useEffect, useState } from 'react';
import { formatEther, maxUint256 } from 'viem';
import { useWeb3Context } from '../context/Web3Context';
import { CHAIN_ID, CONTRACT_ADDRESS } from '../lib/config';
import { contractLink } from '../lib/utils/chain';
import { useWalletConnect } from '../hooks/useWalletConnect';
import Mint from './Mint';

export default function CollectionInfo() {
  const { collectionInfo } = useWeb3Context();
  const { walletAddress } = useWalletConnect();

  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaySupply] = useState(0);
  const [dropStartTimestamp, setDropStartTimestamp] = useState(0);
  const [dropStartDate, setDropStartDate] = useState(new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      loadInfo();
    }
  }, [walletAddress]);

  const loadInfo = () => {
    const dropStart = (Number(collectionInfo?.dropStart) || 0) * 1000;

    setTotalSupply(Number(collectionInfo?.totalSupply) || 0);
    setMaySupply(Number(collectionInfo?.maxSupply) || 0);
    setDropStartTimestamp(dropStart);
    setDropStartDate(new Date(dropStart));

    if (collectionInfo?.drop) {
      if (dropStart > Date.now()) {
        // The data/time we want to countdown to
        countdown(dropStart);

        // Run myFunc every second
        const myFunc = setInterval(() => {
          countdown(dropStart);
          // Display the message when countdown is over
          const timeLeft = dropStart - new Date().getTime();
          if (timeLeft < 0) {
            clearInterval(myFunc);
          }
        }, 1000);
      }
    }
  };

  const countdown = (date: number) => {
    const now = new Date().getTime();
    const timeLeft = date - now;

    // Calculating the days, hours, minutes and seconds left
    setDays(Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    setMinutes(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    setSeconds(Math.floor((timeLeft % (1000 * 60)) / 1000));
  };

  return (
    <>
      {walletAddress && (
        <div className='bg-white'>
          <div>
            <b> Collection address: </b>
            <a href={contractLink(CONTRACT_ADDRESS, CHAIN_ID)} target='_blank' rel='noreferrer'>
              {CONTRACT_ADDRESS}
              <img src='images/icon-open.svg' width={10} height={10} />
            </a>
          </div>
          <div>
            <b> Name: </b>
            {collectionInfo.name}
          </div>
          <div>
            <b> Symbol: </b>
            {collectionInfo.symbol}
          </div>
          <div>
            <b> Revocable: </b>
            {collectionInfo.revokable ? 'TRUE' : 'FALSE'}
          </div>
          <div>
            <b> Soulbound: </b>
            {collectionInfo.soulbound ? 'TRUE' : 'FALSE'}
          </div>
          <div>
            <b> Supply: </b>
            {(() => {
              if (maxSupply && BigInt(maxSupply) >= BigInt(maxUint256)) {
                return <span>{totalSupply.toString()} / &infin;</span>;
              } else {
                return (
                  <span>
                    {Number(totalSupply)} / {Number(maxSupply)}
                  </span>
                );
              }
            })()}
          </div>
          {/* Is drop */}
          {collectionInfo.drop && (
            <div>
              <div>
                <b> Price: </b>
                {formatEther(collectionInfo.price)}
              </div>
              <div className='drop' id='drop'>
                {(() => {
                  if (totalSupply && maxSupply && totalSupply.toString() === maxSupply.toString()) {
                    return <h3>Sold out!</h3>;
                  } else if (dropStartTimestamp > Date.now()) {
                    return (
                      <div>
                        <b> Drop: </b>
                        {dropStartDate.toDateString()} {dropStartDate.toLocaleTimeString()} {days} <b>d </b>
                        {hours} <b>h </b>
                        {minutes} <b>m </b>
                        {seconds} <b>s </b>
                      </div>
                    );
                  } else {
                    return <Mint />;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
