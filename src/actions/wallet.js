import { ACTION_TYPE_UPDATE_WALLET } from 'config';

export function activateWallet() {
  return async(dispatch, getState) => {
    let account;
    try {
      [account] = await window.ethereum.enable();
      dispatch(updateAccount(account));
    } catch (e) {
      console.alert('A web3 capable browser is required!');
    }
    if (account) {
      dispatch(updateAccount(account));
    }
  };
}

export function updateWallet(payload) {
  return {
    type: ACTION_TYPE_UPDATE_WALLET,
    payload,
  };
}

export function updateAccount(account) {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ account }));
  };
}
