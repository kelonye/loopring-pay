import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';

function Component({ children, tokens, dexAccount, fetchMyAccountPage }) {
  const loadInfos = async () => {
    const { accountId, apiKey } = dexAccount.account;
    if (!_.isNil(accountId) && apiKey && tokens.length > 3) {
      fetchMyAccountPage(accountId, apiKey, tokens);
    }
  };

  React.useEffect(() => {
    loadInfos();
  }, [dexAccount.account.accountId, dexAccount.account.apiKey, tokens.length]); // eslint-disable-line

  return <div>{children}</div>;
}

export default connect(({ dexAccount, exchange }, { match }) => {
  return {
    dexAccount,
    tokens: exchange.tokens,
  };
}, mapDispatchToProps)(Component);
