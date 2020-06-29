import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Header from './Header/Header';
import Nav from './Nav/Nav';
import Loader from './Loader';
import Error from './Error';
import { Router } from 'react-router-dom';
import { history } from 'utils/store';
import themeSelector, { isDarkSelector } from 'selectors/theme';
import { CssBaseline } from '@material-ui/core';
import DexAccountService from 'components/services/DexAccountService';
import DexAccountBalanceService from 'components/services/DexAccountBalanceService';
// import MetaMaskService from 'components/services/wallet-services/MetaMaskService';
import Wallet from 'lightcone/wallet';
import { saveWalletType } from 'lightcone/api/localStorgeAPI';
import { WEB3 } from 'utils/wallet';
import { WALLET_UNCONNECTED } from 'actions/DexAccount';

const useStyles = makeStyles(theme => ({
  container: {},
}));

function Component({
  error,
  isLoaded,
  theme,
  isDark,
  fetchAllExchangeInfo,
  account,
  updateAccount,
  dexAccount,
  connectToMetaMaskComplete,
  connectToMetaMask,
  getDataFromLocalStorage,
}) {
  const classes = useStyles();

  React.useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains(isDark ? 'light' : 'dark')) {
      root.classList.remove(isDark ? 'light' : 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  React.useEffect(() => {
    fetchAllExchangeInfo();
  }, []); // eslint-disable-line

  const loadLoopring = async () => {
    const accounts = await WEB3.eth.getAccounts();
    if (!accounts.length) return;
    window.ethereum.accounts = accounts;
    window.wallet = new Wallet('MetaMask', window.web3, accounts[0]);

    updateAccount({
      ...dexAccount.account,
      state: WALLET_UNCONNECTED,
    });

    // this.setupSubscribe();

    saveWalletType('MetaMask');

    getDataFromLocalStorage(accounts[0]);
    console.log(accounts[0]);
    connectToMetaMaskComplete();
    connectToMetaMask(false);
  };

  React.useEffect(() => {
    loadLoopring();
  }, []); // eslint-disable-line

  let pane;
  if (error) {
    pane = <Error {...{ error }} />;
  } else if (isLoaded) {
    pane = (
      <div>
        <DexAccountBalanceService />
        <DexAccountService />
        <Header />
        <Nav />
      </div>
    );
  } else {
    pane = <Loader fullscreen />;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router {...{ history }}>
        <div className={classes.container}>{pane}</div>
      </Router>
    </ThemeProvider>
  );
}

export default connect(state => {
  const {
    app: { isLoaded, error },
    wallet: { account },
    dexAccount,
  } = state;
  let err;
  if (error) {
    console.log(error);
    err = error.message || 'Error Loading Application!';
  }

  return {
    isLoaded,
    error: err,
    theme: themeSelector(state),
    isDark: isDarkSelector(state),
    account,
    dexAccount,
  };
}, mapDispatchToProps)(Component);
