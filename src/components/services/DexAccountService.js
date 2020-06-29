import { connect } from 'react-redux';
import React from 'react';

import {
  LOGGED_IN,
  NOT_REGISTERED,
  REGISTERED,
  REGISTERING,
  RESETTING,
  updateAccount,
} from 'actions/DexAccount';
import {
  getUpdateRecordByAddress,
  removeUpdateRecord,
} from 'lightcone/api/localStorgeAPI';

import { loginModal, registerAccountModal } from 'actions/ModalManager';

import { getApiKey, lightconeGetAccount } from 'lightcone/api/LightconeAPI';

import { canShowLoginModal } from 'components/services/utils';
import Wallet from 'lightcone/wallet/wallet';

class DexAccountService extends React.Component {
  // componentDidMount() {
  //   this.init(this.props);
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.dexAccount.account.state !== this.props.dexAccount.account.state
    ) {
      this.init(this.props);
    }
  }

  async init(props) {
    const { dexAccount, updateAccount } = props;
    const { account } = dexAccount;
    console.log(account.state);
    switch (account.state) {
      case REGISTERED:
        try {
          const relayAccount = await lightconeGetAccount(window.wallet.address);
          updateAccount({
            ...relayAccount,
            address: window.wallet.address,
            keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
          });
        } catch (err) {
          // console.log(err);
        }
        break;

      case NOT_REGISTERED:
        try {
          const relayAccount = await lightconeGetAccount(window.wallet.address);
          if (relayAccount) {
            if (
              relayAccount.publicKeyX === account.publicKeyX &&
              relayAccount.publicKeyY === account.publicKeyY &&
              relayAccount.accountId === account.accountId &&
              !!account.accountKey
            ) {
              if (!relayAccount.frozen) {
                updateAccount({
                  ...account,
                  ...relayAccount,
                  keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                  state: LOGGED_IN,
                });
              } else {
                updateAccount({
                  ...account,
                  ...relayAccount,
                  keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                  state: RESETTING,
                });
              }
            } else {
              updateAccount({
                ...relayAccount,
                address: window.wallet.address,
                keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                state: REGISTERED,
              });
              if (
                !!this.props.exchange.exchangeId &&
                this.props.metaMask.isDesiredNetwork &&
                canShowLoginModal()
              ) {
                this.props.showLoginModal(true);
              }
            }
          }
        } catch (e) {
          if (e.message.indexOf('account not found')) {
            if (
              !!this.props.exchange.exchangeId &&
              this.props.metaMask.isDesiredNetwork
            ) {
              this.props.registerAccountModal(true);
            } else if (!this.props.exchange.exchangeId) {
              this.registerInteval = setInterval(() => {
                if (this.props.exchange.exchangeId) {
                  if (this.props.metaMask.isDesiredNetwork) {
                    this.props.registerAccountModal(true);
                  }
                  clearInterval(this.registerInteval);
                }
              }, 200);
            }
          }
        }
        break;

      case REGISTERING:
        this.interval = setInterval(async () => {
          try {
            const relayAccount = await lightconeGetAccount(
              window.wallet.address
            );
            if (relayAccount) {
              if (
                relayAccount.publicKeyX === account.publicKeyX &&
                relayAccount.publicKeyY === account.publicKeyY &&
                !!account.accountKey
              ) {
                updateAccount({
                  ...account,
                  accountId: relayAccount.accountId,
                  keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                  state: LOGGED_IN,
                });
              } else {
                updateAccount({
                  ...account,
                  accountId: relayAccount.accountId,
                  keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                  state: REGISTERED,
                });
              }
            }
          } catch (e) {
            console.log(e);
          }
        }, 1000);
        break;

      case RESETTING:
        this.lockInterval = setInterval(async () => {
          try {
            const relayAccount = await lightconeGetAccount(
              window.wallet.address
            );
            const updateRecord = getUpdateRecordByAddress(
              window.wallet.address
            );
            if (
              relayAccount &&
              relayAccount.publicKeyX === account.publicKeyX &&
              relayAccount.publicKeyY === account.publicKeyY &&
              !relayAccount.frozen
            ) {
              removeUpdateRecord(window.wallet.address);
              updateAccount({
                keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                state: REGISTERED,
              });
              clearInterval(this.lockInterval);
            } else if (
              updateRecord &&
              (updateRecord.from.publicKeyX !== relayAccount.publicKeyX ||
                updateRecord.from.publicKeyY !== relayAccount.publicKeyY) &&
              !relayAccount.frozen
            ) {
              removeUpdateRecord(window.wallet.address);
              updateAccount({
                ...account,
                accountId: relayAccount.accountId,
                keyNonce: relayAccount.keyNonce ? relayAccount.keyNonce : 0,
                state: REGISTERED,
              });
              clearInterval(this.lockInterval);
            }
          } catch (e) {}
        }, 10000);

        break;

      case LOGGED_IN:
        if (this.interval) {
          clearInterval(this.interval);
        }

        // Update keys only
        window.wallet = new Wallet(
          window.wallet.walletType,
          window.wallet.web3,
          window.wallet.address,
          account.accountId,
          {
            publicKeyX: account.publicKeyX,
            publicKeyY: account.publicKeyY,
            secretKey: account.accountKey,
          }
        );
        const signed = window.wallet.getApiKey();
        const data = {
          accountId: account.accountId,
          publicKeyX: account.publicKeyX,
          publicKeyY: account.publicKeyY,
        };
        console.log(data);
        try {
          const apiKey = await getApiKey(data, signed.signature);
          updateAccount({
            ...account,
            apiKey,
          });
        } catch (error) {}
        break;

      default:
      // console.warn('unhandled account state ', account.state);
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => {
  const { dexAccount, exchange, metaMask } = state;
  return { dexAccount, exchange, metaMask };
};

const mapDispatchToProps = dispatch => {
  return {
    updateAccount: account => dispatch(updateAccount(account)),
    registerAccountModal: show => dispatch(registerAccountModal(show)),
    showLoginModal: show => dispatch(loginModal(show)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DexAccountService);
