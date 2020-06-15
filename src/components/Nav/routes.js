import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BalancesIcon from '@material-ui/icons/AccountBalanceWallet';
import TransfersIcon from '@material-ui/icons/Send';
import DepositsIcon from '@material-ui/icons/ArrowDownward';
import WithdrawalsIcon from '@material-ui/icons/ArrowUpward';

import Balances from 'components/Tabs/Balances';
import Transfers from 'components/Tabs/Transfers';
import Deposits from 'components/Tabs/Deposits';
import Withdrawls from 'components/Tabs/Withdrawls';

export const ROUTES = ['/', '/transfers', '/deposits', '/withdrawls'];

export const ROUTE_COMPONENTS = [Balances, Transfers, Deposits, Withdrawls];

export const ROUTE_LABELS = ['Balances', 'Transfers', 'Deposits', 'Withdrawls'];

export const ROUTE_ICONS = [
  BalancesIcon,
  TransfersIcon,
  DepositsIcon,
  WithdrawalsIcon,
];

export const Switcher = () => (
  <Switch>
    {ROUTES.map((path, i) => (
      <Route
        exact
        key={path}
        path={`${ROUTES[i]}`}
        component={ROUTE_COMPONENTS[i]}
      />
    ))}

    {/*<Route exact path={'/transfer/:token'} component={TransferToken} />*/}
  </Switch>
);
