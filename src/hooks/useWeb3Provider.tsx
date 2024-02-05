import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify'

export interface IWeb3State {
  address: string | null;
  currentChain: number | null;
  signer: Signer | null;
  provider: Provider | null;
  isAuthenticated: boolean;
}

const useWeb3Provider = () => {
  const initialWeb3State = {
    address: null,
    currentChain: null,
    signer: null,
    provider: null,
    isAuthenticated: false,
  };

  const [state, setState] = useState<IWeb3State>(initialWeb3State);

  const connectWallet = useCallback(async () => {
    // if (state.isAuthenticated) return;

    try {
      const { ethereum } = window;
      console.log(ethereum);

      if (!ethereum) {
        console.error(ethereum);
        toast('No ethereum wallet found', { type: 'error' })
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);

      const accounts: string[] = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const chain = Number(await (await provider.getNetwork()).chainId);

        setState({
          ...state,
          address: accounts[0],
          signer,
          currentChain: chain,
          provider,
          isAuthenticated: true,
        });
        console.log(state);

        localStorage.setItem("isAuthenticated", "true");
      }
    } catch {}
  }, [state, toast]);

  const disconnect = () => {
    setState(initialWeb3State);
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    if (window == null) return;

    if (localStorage.hasOwnProperty("isAuthenticated")) {
      connectWallet();
    }
  }, [connectWallet, state.isAuthenticated]);

  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    window.ethereum.on("accountsChanged", (...args: unknown[]) => {
      console.log(args)
      setState({ ...state, address: args[0] });
    });

    window.ethereum.on("networkChanged", (...args: unknown[]) => {
      console.log(args)
      setState({ ...state, currentChain: Number(args) });
    });

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts)
      setState({ ...state, address: accounts[0] });
    });

    window.ethereum.on("networkChanged", (network: string) => {
      console.log(network)
      setState({ ...state, currentChain: Number(network) });
    });

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, [state]);

  return {
    connectWallet,
    disconnect,
    state,
  };
};

export default useWeb3Provider;
