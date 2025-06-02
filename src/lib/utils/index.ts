import { toast } from 'react-toastify';

export function checkInputAddress(address: string) {
  if (!address) {
    toast('Enter contract address!', { type: 'warning' });
    return false;
  }
  return true;
}
export function checkInputAmount(amount: number) {
  if (amount && Number(amount) > 0 && Number(amount) <= 5) {
    return true;
  }
  toast('Enter valid amount (number from 1 to 5)!', { type: 'warning' });
  return false;
}
export function checkInputToken(token: string | number) {
  if (token && Number(token) >= 0) {
    return true;
  }
  toast('Enter token ID!', { type: 'warning' });
  return false;
}
