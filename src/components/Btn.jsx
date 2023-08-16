import React from 'react'
import Spinner from './Spinner'

const Btn = ({ loading, disabled, onClick, children, ...attrs }) => {
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      onClick(event)
    }
  }

  return (
    <button {...attrs} onClick={handleClick}>
      {loading && (
         <Spinner />
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  )
}

export default Btn
