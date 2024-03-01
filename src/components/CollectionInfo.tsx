import { constants, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Mint from './Mint'
import { CHAIN_ID } from '../lib/config'
import useWeb3Provider from '../hooks/useWeb3Provider'
import MintNestable from './MintNestable'

interface CollectionInfoProps {
  nftId: number
}

export default function CollectionInfo({ nftId }: CollectionInfoProps) {
  const { state } = useWeb3Provider()

  const [totalSupply] = useState(state.collectionInfo?.totalSupply || 0)
  const [maxSupply] = useState(state.collectionInfo?.maxSupply || 0)
  const [dropStartDate, setDropStartDate] = useState(new Date())
  const [dropStartTimestamp, setDropStartTimestamp] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const setupDropStartTimestamp = () => {
    if (dropStartTimestamp) return dropStartTimestamp

    const newTimestamp = state.collectionInfo.dropStart.toNumber() * 1000
    setDropStartTimestamp(newTimestamp)

    return newTimestamp
  }

  useEffect(() => {
    if (state.collectionInfo?.address) {
      loadInfo()
    }
  }, [state])

  function loadInfo() {
    if (state.collectionInfo?.drop) {
      const dropStartTimestamp = setupDropStartTimestamp()
      setDropStartDate(new Date(dropStartTimestamp))

      if (dropStartTimestamp > Date.now()) {
        // The data/time we want to countdown to
        countdown(dropStartTimestamp)

        // Run myFunc every second
        const myFunc = setInterval(() => {
          countdown(dropStartTimestamp)
          // Display the message when countdown is over
          const timeLeft = dropStartTimestamp - new Date().getTime()
          if (timeLeft < 0) {
            clearInterval(myFunc)
          }
        }, 1000)
      }
    }
  }

  const countdown = (date: number) => {
    const now = new Date().getTime()
    const timeLeft = date - now

    // Calculating the days, hours, minutes and seconds left
    setDays(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
    setHours(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    setMinutes(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))
    setSeconds(Math.floor((timeLeft % (1000 * 60)) / 1000))
  }

  function collectionLink() {
    switch (CHAIN_ID) {
      case '0x504':
        return `https://moonbeam.moonscan.io/address/${state.collectionInfo.address}`
      case '0x507':
        return `https://moonbase.moonscan.io/address/${state.collectionInfo.address}`
      case '0x250':
        return `https://astar.subscan.io/address/${state.collectionInfo.address}`
      default:
        console.warn('Missing chainId')
        return 'https://moonbeam.moonscan.io'
    }
  }

  return (
    <>
      {state.collectionInfo?.address && (
        <div className="collection-info" id="collection">
          <div>
            <b> Collection address: </b>
            <a href={collectionLink()} target="_blank" rel="noreferrer">
              {state.collectionInfo.address}
              <img src="images/icon-open.svg" width={10} height={10} />
            </a>
          </div>
          <div>
            <b> Name: </b>
            {state.collectionInfo.name}
          </div>
          <div>
            <b> Symbol: </b>
            {state.collectionInfo.symbol}
          </div>
          <div>
            <b> Revocable: </b>
            {state.collectionInfo.revokable ? 'TRUE' : 'FALSE'}
          </div>
          <div>
            <b> Soulbound: </b>
            {state.collectionInfo.soulbound ? 'TRUE' : 'FALSE'}
          </div>
          <div>
            <b> Supply: </b>
            {(() => {
              if (maxSupply && maxSupply.toString() === constants.MaxUint256.toString()) {
                return <span>{totalSupply.toString()} / &infin;</span>
              } else {
                return (
                  <span>
                    {Number(totalSupply)} / {Number(maxSupply)}
                  </span>
                )
              }
            })()}
          </div>
          {/* Is drop */}
          {state.collectionInfo.drop && (
            <div>
              <div>
                <b> Price: </b>
                {ethers.utils.formatEther(state.collectionInfo.price)}
              </div>
              <div className="drop" id="drop">
                {(() => {
                  if (totalSupply && maxSupply && totalSupply.toString() === maxSupply.toString()) {
                    return <h3>Sold out!</h3>
                  } else if (dropStartTimestamp > Date.now()) {
                    return (
                      <div>
                        <b> Drop: </b>
                        {dropStartDate.toDateString()} {dropStartDate.toLocaleTimeString()} {days} <b>d </b>
                        {hours} <b>h </b>
                        {minutes} <b>m </b>
                        {seconds} <b>s </b>
                      </div>
                    )
                  } else if (nftId > 0) {
                    return <MintNestable nftId={nftId} />
                  } else {
                    return <Mint />
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
