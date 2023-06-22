import React from 'react'

export default function Spinner () {
  return (
    <span>
      <svg
        className="spinner"
        style={{
          margin: '-12px 0 0 -12px',
          width: '24px',
          height: '24px'
        }}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="path"
        ></circle>
      </svg>
    </span>
  )
}
