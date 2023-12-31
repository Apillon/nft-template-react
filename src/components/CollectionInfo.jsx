import { constants, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import Mint from './Mint'

export default function Collection ({ collection, provider, address }) {
  const [totalSupply] = useState(collection.totalSupply)
  const [maxSupply] = useState(collection.maxSupply)
  const [dropStartDate, setDropStartDate] = useState(new Date())
  const [dropStartTimestamp, setDropStartTimestamp] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const setupDropStartTimestamp = () => {
    if (dropStartTimestamp) return dropStartTimestamp

    const newTimestamp = collection.dropStart.toNumber() * 1000
    setDropStartTimestamp(newTimestamp)

    return newTimestamp
  }

  useEffect(() => {
    if (collection) {
      loadInfo()
    }
  }, [])

  function loadInfo () {
    if (collection.drop) {
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

  const countdown = (date) => {
    const now = new Date().getTime()
    const timeLeft = date - now

    // Calculating the days, hours, minutes and seconds left
    setDays(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
    setHours(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    setMinutes(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))
    setSeconds(Math.floor((timeLeft % (1000 * 60)) / 1000))
  }

  function collectionLink () {
    const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
    switch (CHAIN_ID) {
      case '0x504':
        return `https://moonbeam.moonscan.io/address/${collection.address}`
      case '0x507':
        return `https://moonbase.moonscan.io/address/${collection.address}`
      case '0x250':
        return `https://astar.subscan.io/address/${collection.address}`
      default:
        console.warn('Missing chainId')
        return 'https://moonbeam.moonscan.io'
    }
  }

  return (
    <div className="collection-info" id="collection">
      <div>
        <b> Collection address: </b>
        <a href={collectionLink()} target="_blank" rel="noreferrer">
          {collection.address}
          <img src="images/icon-open.svg" width={10} height={10} />
        </a>
      </div>
      <div>
        <b> Name: </b>
        {collection.name}
      </div>
      <div>
        <b> Symbol: </b>
        {collection.symbol}
      </div>
      <div>
        <b> Revocable: </b>
        {collection.revokable ? 'TRUE' : 'FALSE'}
      </div>
      <div>
        <b> Soulbound: </b>
        {collection.soulbound ? 'TRUE' : 'FALSE'}
      </div>
      <div>
        <b> Supply: </b>
        {(() => {
          if (maxSupply.toString() === constants.MaxUint256.toString()) {
            return (<div>{totalSupply.toString()} / &infin;</div>)
          } else {
            return (<div>{totalSupply.toString()} / {maxSupply.toString()}</div>)
          }
        })()}

      </div>
      {/* Is drop */}
      {collection.drop && (
        <div>
          <div>
            <b> Price: </b>
            {ethers.utils.formatEther(collection.price)}
          </div>
          {(() => {
            if (totalSupply && maxSupply && totalSupply.toString() === maxSupply.toString()) {
              return <h3>Sold out!</h3>
            } else if (dropStartTimestamp > Date.now()) {
              return (
                <div className="drop" id="drop">
                  <div>
                    <b> Drop: </b>
                    {dropStartDate.toDateString()} {dropStartDate.toLocaleTimeString()} {days}{' '}
                    <b>d </b>
                    {hours} <b>h </b>
                    {minutes} <b>m </b>
                    {seconds} <b>s </b>
                  </div>
                </div>
              )
            } else {
              return (<div className="drop"><Mint price={collection.price} provider={provider} address={address} /></div>)
            }
          })()}
        </div>
      )}
    </div>
  )
}
