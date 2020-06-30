import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import Desktop from './BalancesDesktop';
import Mobile from './BalancesMobile';
import Loader from 'components/Loader';
// import { fetchWalletBalance } from 'modals/components/utils';
// import { add } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import Transfer from 'components/Tabs/Transfer';
import Deposit from 'components/Tabs/Deposit';
import Withdraw from 'components/Tabs/Withdraw';

const Component = ({
  tokens,
  address,
  isMobile,
  balances: balancesOnLoopringList,
  balanceOnEthereumDict,
  loadEthereumBalances,
  isLoadingEthereumBalances,
}) => {
  const balances = tokens.map(
    token =>
      balancesOnLoopringList.find(ba => ba.token.tokenId === token.tokenId) || {
        token,
        totalAmountInString: Number(0).toFixed(token.precision),
        available: Number(0).toFixed(token.precision),
        availableInAssetPanel: Number(0).toFixed(token.precision),
      }
  );

  React.useEffect(() => {
    loadEthereumBalances();
  }, [address]); // eslint-disable-line

  return (
    <div>
      {isLoadingEthereumBalances ? (
        <Loader />
      ) : (
        <div>
          {isMobile ? (
            <Mobile {...{ balances, balanceOnEthereumDict }} />
          ) : (
            <Desktop {...{ balances, balanceOnEthereumDict }} />
          )}

          <Switch>
            <Route exact path={'/balances/transfer'} component={Transfer} />
            <Route exact path={'/balances/deposit'} component={Deposit} />
            <Route exact path={'/balances/withdraw'} component={Withdraw} />
          </Switch>
        </div>
      )}
    </div>
  );
};

export default connect(
  ({
    app: { isMobile },
    wallet: {
      account: address,
      balanceOnEthereumDict,
      isLoadingEthereumBalances,
    },
    dexAccount,
    balances: { balances },
    exchange,
  }) => {
    return {
      isMobile,
      address,
      dexAccount,
      balances,
      exchange,
      tokens: exchange.tokens,
      balanceOnEthereumDict,
      isLoadingEthereumBalances,
    };
  },
  mapDispatchToProps
)(Component);
