import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import Desktop from './BalancesDesktop';
import Mobile from './BalancesMobile';
import Loader from 'components/Loader';
import { fetchWalletBalance } from 'modals/components/utils';
// import { add } from 'lodash';

const Component = ({
  tokens,
  address,
  isMobile,
  balances: balancesOnLoopringList,
}) => {
  const [balanceOnEthereumDict, setBalanceOnEthereumDict] = React.useState({});
  const [isBalancesLoading, setIsBalancesLoading] = React.useState({});
  // const [searchInput, setSearchInput] = React.useState({});

  const balances = tokens.map(
    token =>
      balancesOnLoopringList.find(ba => ba.token.tokenId === token.tokenId) || {
        token,
        totalAmountInString: Number(0).toFixed(token.precision),
        available: Number(0).toFixed(token.precision),
        availableInAssetPanel: Number(0).toFixed(token.precision),
      }
  );

  const loadBalances = async () => {
    try {
      setIsBalancesLoading(true);
      const balanceOnEthereumDict = {};
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        balanceOnEthereumDict[token.symbol] = await fetchWalletBalance(
          address,
          token.symbol,
          tokens
        );
      }
      setBalanceOnEthereumDict(balanceOnEthereumDict);
    } catch (error) {
    } finally {
      setIsBalancesLoading(false);
    }
  };

  React.useEffect(() => {
    loadBalances();
  }, [address]); // eslint-disable-line

  return (
    <div>
      {isBalancesLoading ? (
        <Loader />
      ) : (
        <div>
          {isMobile ? (
            <Mobile {...{ balances, balanceOnEthereumDict }} />
          ) : (
            <Desktop {...{ balances, balanceOnEthereumDict }} />
          )}
        </div>
      )}
    </div>
  );
};

export default connect(
  ({
    app: { isMobile },
    wallet: { account: address },
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
    };
  },
  mapDispatchToProps
)(Component);
