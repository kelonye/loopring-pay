import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    width: 130,
    margin: '0 5px;',
  },
}));

function Component() {
  const classes = useStyles();
  return <div className={classes.container}>WIP</div>;
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);
