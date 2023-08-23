import { toast } from 'react-toastify'

export function transactionError (msg, error) {
  if (error) {
    const errorMsg = (typeof error === 'string')
      ? error
      : (typeof error === 'object' && error?.data?.message)
          ? error.data.message
          : (typeof error === 'object' && error?.message) ? error.message : JSON.stringify(error)

    if (errorMsg.includes('rejected') || errorMsg.includes('denied')) {
      toast('Transaction has been rejected', { type: 'info' })
      return
    } else if (errorMsg.includes('OutOfFund')) {
      toast('Your account balance is too low', { type: 'warning' })
      return
    } else if (errorMsg.includes('account balance too low')) {
      toast('Your account balance is too low', { type: 'warning' })
      return
    } else if (error?.message.includes('transaction')) {
      toast('Transaction failed', { type: 'warning' })
      return
    }
  }
  toast(msg, { type: 'error' })
}
