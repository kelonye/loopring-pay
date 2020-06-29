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
import UserIcon from '@material-ui/icons/AccountCircle';
import { isDarkSelector } from 'selectors/theme';
import { APP_TITLE } from 'config';
import { LOGGED_IN, RESETTING } from 'actions/DexAccount';
import { lightconeGetAccount } from 'lightcone/api/LightconeAPI';
import ETHAvatar from 'ethereum-identicon';

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
  exchangeAddress,
  dexAccount,
  address,
  updateAccount,
  activateWallet,
  isMobile,
}) {
  const classes = useStyles();
  const isLoggedIn = Boolean(address);
  const { account } = dexAccount;

  const disconnect = async () => {};

  const connect = async () => {
    try {
      const relayAccount = await lightconeGetAccount(window.wallet.address);

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
          ...account, // todo: switch to this
          ...relayAccount,
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
      // notifyError(<I s="LoginFailedNotification" />, this.props.theme);
      // _this.setState({
      //   loading: false,
      //   showError: false,
      // });
    }
  };

  let session;
  if (isLoggedIn) {
    session = isMobile ? (
      <ETHAvatar {...{ address }} diameter={22} />
    ) : (
      <>
        <div className={classes.account}>{address}</div>
        <Button color="secondary" onClick={connect}>
          Connect to Loopring
        </Button>
        <Button color="secondary" onClick={disconnect}>
          Sign Out
        </Button>
      </>
    );
  } else {
    session = isMobile ? (
      <IconButton onClick={connect}>
        <UserIcon />
      </IconButton>
    ) : (
      <Button color="secondary" onClick={activateWallet}>
        Connect Account
      </Button>
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
