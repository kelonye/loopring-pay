import { ACTION_TYPE_UPDATE_WALLET } from 'config';
import { fetchWalletBalance } from 'modals/components/utils';

export function activateWallet() {
  return async (dispatch, getState) => {
    let account;
    try {
      [account] = await window.ethereum.enable();
      dispatch(customUpdateAccount(account));
    } catch (e) {
      console.alert('A web3 capable browser is required!');
    }
    if (account) {
      dispatch(customUpdateAccount(account));
    }
  };
}

export function updateWallet(payload) {
  return {
    type: ACTION_TYPE_UPDATE_WALLET,
    payload,
  };
}

export function customUpdateAccount(account) {
  return async (dispatch, getState) => {
    dispatch(updateWallet({ account }));
  };
}

export function loadEthereumBalances() {
  return async (dispatch, getState) => {
    const {
      wallet: { loadedEthereumBalances },
      dexAccount: {
        account: { address },
      },
      exchange: { tokens },
    } = getState();
    if (loadedEthereumBalances) {
      return;
    }

    dispatch(updateWallet({ isLoadingEthereumBalances: true }));
    const balanceOnEthereumDict = {};
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      balanceOnEthereumDict[token.symbol] = await fetchWalletBalance(
        address,
        token.symbol,
        tokens
      );
    }
    dispatch(
      updateWallet({
        balanceOnEthereumDict,
        isLoadingEthereumBalances: false,
        loadedEthereumBalances: true,
      })
    );
  };
}
