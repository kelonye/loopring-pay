import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Loader from 'components/Loader';
import { SECONDARY_COLOR } from 'config';
import { LOGGED_IN, RESETTING } from 'actions/DexAccount';
import { lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import LoadAccount from './LoadAccount';
// import DexAccountBalanceService from 'components/services/DexAccountBalanceService';
// import MetaMaskService from 'components/services/wallet-services/MetaMaskService';
import Wallet from 'lightcone/wallet';
import { saveWalletType } from 'lightcone/api/localStorgeAPI';
import { WALLET_UNCONNECTED, NOT_REGISTERED } from 'actions/DexAccount';
import sl from 'utils/sl';

const useStyles = makeStyles(theme => ({
  loopringButton: {
    backgroundColor: '#007cc3',
    boxShadow: 'none',
    borderBottom: 'solid 4px #1b3544',
    color: '#1b3544',
    '&:hover': {
      backgroundColor: '#7aceff',
    },
  },
  metaMaskButton: {
    backgroundColor: '#f5841f',
    boxShadow: 'none',
    borderBottom: 'solid 4px #763e1a',
    color: '#763e1a',
    '&:hover': {
      backgroundColor: '#f5841f',
    },
  },
  walletError: {
    color: SECONDARY_COLOR,
    marginTop: 10,
  },
}));

const Component = ({
  fetchAllExchangeInfo,
  address,
  isLoading,
  exchangeAddress,
  dexAccount,
  activateWallet,
  children,
  updateAccount,
  connectToMetaMaskComplete,
  connectToMetaMask,
  getDataFromLocalStorage,

  exchange,
  nonce,
  gasPrice,
}) => {
  const classes = useStyles();
  const { account } = dexAccount;
  const unregistered = account.state === NOT_REGISTERED;

  const connect = async () => {
    if (!address) return;

    try {
      const relayAccount = await lightconeGetAccount(address);

      const result = await window.wallet.generateKeyPair(
        exchangeAddress,
        relayAccount.keyNonce
      );

      const { keyPair, error } = result;

      if (error) {
        throw new Error(error.message);
      }

      if (
        !!keyPair &&
        !!keyPair.secretKey &&
        keyPair.publicKeyX === relayAccount.publicKeyX &&
        keyPair.publicKeyY === relayAccount.publicKeyY
      ) {
        const state = relayAccount.frozen ? RESETTING : LOGGED_IN;
        updateAccount({
          ...account,
          accountKey: keyPair.secretKey,
          state,
        });

        //   _this.onClose();
      } else {
        //   _this.setState({
        //     loading: false,
        //     showError: relayAccount.keyNonce === account.keyNonce,
        //   });

        updateAccount({
          ...account,
          publicKeyX: relayAccount.publicKeyX,
          publicKeyY: relayAccount.publicKeyY,
          keyNonce: relayAccount.keyNonce,
        });
      }
    } catch (err) {
      console.log(err);
      // notifyError(<I s="LoginFailedNotification" />, theme);
      // _this.setState({
      //   loading: false,
      //   showError: false,
      // });
    }
  };

  const register = async () => {
    sl(
      'error',
      'This feature is being worked on. Please use an already registered account.'
    );

    // setIsLoading(true);
    // try {
    //   const fee = formatter
    //     .toBig(config.getFeeByType('create', exchange.onchainFees).fee)
    //     .plus(config.getFeeByType('deposit', exchange.onchainFees).fee);
    //   const { keyPair } = await window.wallet.generateKeyPair(
    //     exchange.exchangeAddress,
    //     0
    //   );
    //   if (!keyPair || keyPair.secretKey === undefined) {
    //     throw new Error('Failed to generate keyPair.');
    //   }
    //   this.setState({
    //     processingNum: processingNum + 1,
    //   });
    //   // Add a delay for WalletConnect. Their server is not real time to response.
    //   // We can change 10 seconds to shorter
    //   if (getWalletType() === 'WalletConnect') {
    //     await sleep(6000);
    //   }
    //   await window.wallet.createOrUpdateAccount(
    //     keyPair,
    //     {
    //       exchangeAddress: exchange.exchangeAddress,
    //       fee: fee.toString(),
    //       chainId: exchange.chainId,
    //       token: config.getTokenBySymbol('ETH', exchange.tokens),
    //       amount: '',
    //       permission: '',
    //       nonce: nonce.nonce,
    //       gasPrice: gasPrice.gasPrice,
    //     },
    //     true
    //   );
    //   const account = {
    //     address: window.wallet.address,
    //     publicKeyX: keyPair.publicKeyX,
    //     publicKeyY: keyPair.publicKeyY,
    //     accountKey: keyPair.secretKey,
    //     state: REGISTERING,
    //   };
    //   updateAccount(account);
    //   //setReferrer or  promotion code
    //   try {
    //     if (referrer) {
    //       const reg = new RegExp('^([1-9][0-9]{0,6})$');
    //       if (!Number.isNaN(referrer) && reg.test(referrer)) {
    //         await setRefer(
    //           {
    //             address: window.wallet.address,
    //             referrer,
    //           },
    //           keyPair
    //         );
    //         removeReferralId();
    //       } else {
    //         await setRefer(
    //           {
    //             address: window.wallet.address,
    //             promotionCode: referrer,
    //           },
    //           keyPair
    //         );
    //       }
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     console.log('failed to set referrer or promotion code');
    //   }
    //   // // If it's from invite, navigate to trade page
    //   // if (pathname.startsWith("/invite/")) {
    //   //   history.push("/trade");
    //   // }
    //   // notifySuccess(
    //   //   <I s="AccountBeingRegisteredNotification" />,
    //   //   theme
    //   // );
    // } catch (err) {
    //   console.log(err);
    //   // notifyError(
    //   //   <I s="AccountRegistrationFailedNotification" />,
    //   //   theme
    //   // );
    // } finally {
    //   setProcessingNum(1);
    // }
  };

  const loadInfos = async () => {
    await fetchAllExchangeInfo();

    if (!address) return;
    window.ethereum.accounts = [address];
    window.wallet = new Wallet('MetaMask', window.web3, address);

    updateAccount({
      ...dexAccount.account,
      state: WALLET_UNCONNECTED,
    });

    // this.setupSubscribe();

    saveWalletType('MetaMask');
    getDataFromLocalStorage(address);
    connectToMetaMaskComplete();
    connectToMetaMask(false);
  };

  React.useEffect(() => {
    loadInfos();
  }, []); // eslint-disable-line

  if (isLoading) {
    return <Loader />;
  }

  if (dexAccount.account.state === LOGGED_IN) {
    return <LoadAccount>{children}</LoadAccount>;
  }

  return (
    <div style={{ margin: 10, padding: 50 }}>
      <div
        className="flex flex--justify-center text-center"
        style={{ marginBottom: 30 }}
      >
        <h1>
          Connect to Loopring Pay to Enjoy <em>free</em> ETH and ERC20 Token
          Swaps and Transfers.
        </h1>
      </div>
      {address ? (
        <div>
          <Button
            variant="contained"
            onClick={unregistered ? register : connect}
            className={classes.loopringButton}
            fullWidth
          >
            {unregistered
              ? 'Register New Loopring Account'
              : 'Connect to Loopring'}
          </Button>
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            onClick={activateWallet}
            className={classes.metaMaskButton}
            fullWidth
          >
            Connect Wallet
          </Button>
          {/*
            <div
              className={clsx(
                classes.walletError,
                'flex',
                'flex--justify-center',
                'center-align'
              )}
            >
              {account
                ? null
                : 'A Web 3.0-enabled Ethereum Wallet (such as MetaMask) is required'}
            </div>
            */}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const {
    wallet: { account: address },
    dexAccount,
    exchange,
  } = state;
  return {
    address,
    dexAccount,
    exchangeAddress: exchange.exchangeAddress,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
