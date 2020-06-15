import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import Mobile from './Mobile';
import Desktop from './Desktop';

const Component = ({ isMobile }) => (isMobile ? <Mobile /> : <Desktop />);

export default connect(state => {
  const {
    app: { isMobile },
  } = state;
  return {
    isMobile,
  };
}, mapDispatchToProps)(Component);
