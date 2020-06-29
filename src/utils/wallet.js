import Web3 from 'web3';

export const WEB3 = (window.WEB3 = (() => {
  // // Modern dapp browsers...
  // if (window.ethereum) {
  //   return new Web3(window.ethereum);
  // }
  // // Legacy dapp browsers...
  // else if (window.web3) {
  //   return new Web3(window.web3.currentProvider);
  // }
  // // Non-dapp browsers...
  // else {
  //   console.log(
  //     'Non-Ethereum browser detected. You should consider trying MetaMask!'
  //   );
  //   return new Web3(
  //     new Web3.providers.HttpProvider(
  //       'https://mainnet.infura.io/v3/90b4177113144a0c82b2b64bc01950e1'
  //     )
  //   );
  // }

  const web3 = new Web3(Web3.givenProvider);
  window.web3 = web3;
  // Need to reset etheruem manually.
  // In the implementation, if windown.ethereum is not null,\
  // it will be reset by MetaMask.
  window.ethereum = Web3.givenProvider;

  return web3;
})());
