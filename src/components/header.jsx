import React from 'react'

export default function Header () {
  return (
    <div className="header br">
      <div className="header-l">
        <h1>
          A matter of minutes. And zero developing costs. Want to build your own
          NFT collection?
        </h1>
        <a href="https://apillon.io/" className="builders" target="_blank" rel="noreferrer">
          Build with Apillon
        </a>
      </div>
      <div className="header-r">
        <img src="images/header.svg" />
      </div>
    </div>
  )
}
