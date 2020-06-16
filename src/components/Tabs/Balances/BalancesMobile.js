import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { isDarkSelector } from 'selectors/theme';

const useStyles = makeStyles(theme => ({
  container: props => ({
    background: props.isDark ? '#424242' : 'white',
  }),
  item: {
    color: theme.palette.text.primary,
    padding: '5px',
    margin: '5px 0',
    display: 'block',
  },
  asset: {
    color: theme.palette.text.secondary,
    marginLeft: 7,
  },
  row: {
    marginTop: 5,
    marginLeft: 7,
    marginRight: 7,
  },
  label: {
    color: '#999',
    fontSize: 11,
  },
  value: {
    fontSize: 11,
  },
  actions: {
    marginTop: 5,
  },
}));

const Component = ({ balances, balanceOnEthereumDict, isDark }) => {
  const classes = useStyles({ isDark });

  return (
    <div className={classes.container}>
      {balances.map(balance => (
        <div
          className={clsx(classes.item, 'list-divider')}
          key={balance.token.symbol}
        >
          <div className={clsx('flex flex--align-center', classes.asset)}>
            {balance.token.symbol} - {balance.token.name}
            {/* <I s={balance.token.name} /> */}
          </div>

          <div className={clsx('flex flex--align-center', classes.row)}>
            <div className={clsx('flex flex--grow', classes.label)}>
              Balance on Ethereum
            </div>
            <div className={clsx(classes.value)}>
              {balanceOnEthereumDict[balance.token.symbol]}
            </div>
          </div>

          <div className={clsx('flex flex--align-center', classes.row)}>
            <div className={clsx('flex flex--grow', classes.label)}>
              Balance on Loopring
            </div>
            <div className={clsx(classes.value)}>
              {balance.totalAmountInString}
            </div>
          </div>

          <div className={clsx('flex flex--align-center', classes.row)}>
            <div className={clsx('flex flex--grow', classes.label)}>
              Available Balance
            </div>
            <div className={clsx(classes.value)}>
              {balance.availableInAssetPanel}
            </div>
          </div>

          <div className={clsx('flex flex--align-center', classes.actions)}>
            <Button size="small" color="secondary">
              Transfer
            </Button>
            <Button size="small" color="default">
              Deposit
            </Button>
            <Button size="small" color="default">
              Withdraw
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default connect(state => {
  return {
    isDark: isDarkSelector(state),
  };
}, mapDispatchToProps)(Component);
