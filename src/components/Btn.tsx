import { BaseSyntheticEvent } from 'react'
import Spinner from './Spinner'

const Btn = ({
  loading,
  onClick,
  children,
  disabled,
  ...attrs
}: {
  [x: string]: any
  loading: boolean
  disabled: boolean
  onClick: Function
  children: any
}) => {
  const handleClick = (event: BaseSyntheticEvent) => {
    if (disabled || loading) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      onClick(event)
    }
  }

  return (
    <button {...attrs} className={disabled ? 'relative disabled' : 'relative'} onClick={(e) => handleClick(e)}>
      {loading && <Spinner />}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  )
}

export default Btn
