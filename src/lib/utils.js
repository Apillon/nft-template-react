function browserName() {
  let userAgent = navigator.userAgent;
  let browserName = "";

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else if (userAgent.match(/brave/i)) {
    browserName = "brave";
  } else {
    browserName = "No browser detection";
  }
  return browserName;
}
function browserSupportsMetaMask() {
  return ["chrome", "firefox", "brave", "edge", "opera"].includes(
    browserName()
  );
}
export const metamaskNotSupportedMessage = () => {
  return browserSupportsMetaMask()
    ? "You need MetaMask extension to connect wallet!"
    : "Your browser does not support MetaMask, please use another browser!";
};

export const addChain = async (chainId) => {
  const { ethereum } = window;

  if (chainId == 0x507) {
    // moonbase
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          rpcUrls: ["https://rpc.api.moonbase.moonbeam.network/"],
          chainName: "Moonbase",
          nativeCurrency: {
            name: "DEV",
            symbol: "DEV",
            decimals: 18,
          },
          blockExplorerUrls: ["https://moonbase.moonscan.io/"],
        },
      ],
    });
  } else if (chainId == 0x504) {
    // moonbeam
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          rpcUrls: ["https://rpc.api.moonbeam.network/"],
          chainName: "Moonbeam",
          nativeCurrency: {
            name: "GLMR",
            symbol: "GLMR",
            decimals: 18,
          },
          blockExplorerUrls: ["https://moonscan.io/"],
        },
      ],
    });
  } else if (chainId == 0x250) {
    // moonbeam
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          rpcUrls: ["https://evm.astar.network/"],
          chainName: "Astar",
          nativeCurrency: {
            name: "ASTR",
            symbol: "ASTR",
            decimals: 18,
          },
          blockExplorerUrls: ["https://blockscout.com/astar"],
        },
      ],
    });
  } else {
    throw new Error("Wrong CHAIN_ID");
  }
};

export const getCurrentChain = async () => {
  const { ethereum } = window;
  return await ethereum.request({ method: "eth_chainId" });
};
export const switchChain = async (chainId) => {
  const { ethereum } = window;
  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }], // chainId must be in HEX with 0x in front
  });
};
