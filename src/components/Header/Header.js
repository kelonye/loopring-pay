import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  AppBar,
  Typography,
  Toolbar,
  Button,
} from '@material-ui/core';
import LightIcon from '@material-ui/icons/Brightness7';
import DarkIcon from '@material-ui/icons/Brightness4';
import { isDarkSelector } from 'selectors/theme';
import { APP_TITLE } from 'config';
import { LOGGED_IN } from 'actions/DexAccount';
import ETHAvatar from 'ethereum-identicon';
import sl from 'utils/sl';

const useStyles = makeStyles(theme => ({
  container: {
    '& .MuiToolbar-gutters': {
      paddingRight: 0,
    },
  },
  account: {
    marginRight: 10,
  },
  balance: {
    marginRight: 10,
  },
}));

function Component({
  toggleTheme,
  isDark,
  address,
  dexAccount,
  isMobile,
  logoutAll,
}) {
  const classes = useStyles();
  const isLoggedIn = dexAccount.account.state === LOGGED_IN;
  const disconnect = () => {
    sl('warning', 'Disconnect from Loopring?', 'Warning', () => {
      // If it's WalletConnect, close provider session.
      // so that next time it will require QR code.
      console.log('LogoutModal', window.wallet);

      if (window.wallet && window.wallet.walletType === 'WalletConnect') {
        (async () => {
          try {
            await window.ethereum.close();
            logoutAll();
          } catch (error) {
            console.log(error);
          }
        })();
      } else if (window.wallet && window.wallet.walletType === 'MetaMask') {
        logoutAll();
      }
    });
  };

  let session;
  if (isLoggedIn) {
    session = isMobile ? (
      <IconButton color="secondary" onClick={disconnect}>
        <ETHAvatar {...{ address }} diameter={22} />
      </IconButton>
    ) : (
      <>
        <div className={classes.account}>{address}</div>
        <Button color="secondary" onClick={disconnect}>
          Disconnect
        </Button>
      </>
    );
  }

  return (
    <AppBar position="fixed" color="inherit" className={classes.container}>
      <Toolbar color="inherit">
        <Typography variant="h6" className={'flex flex--grow'}>
          {APP_TITLE}
        </Typography>

        {session}

        <Tooltip title="Toggle light/dark theme">
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle light/dark theme"
          >
            {isDark ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = state => {
  const {
    app: { isMobile },
    wallet: { account: address },
    dexAccount,
    exchange,
  } = state;
  return {
    isDark: isDarkSelector(state),
    address,
    dexAccount,
    exchangeAddress: exchange.exchangeAddress,
    isMobile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
