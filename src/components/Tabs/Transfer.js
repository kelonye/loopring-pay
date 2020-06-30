import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';
import sl from 'utils/sl';

const useStyles = makeStyles(theme => ({
  rowHeading: {
    marginBottom: 10,
    // color: theme.palette.action.active,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12, // '1rem',
    fontWeight: 400,
    lineHeight: 1,
  },
  button: {
    width: 130,
    margin: '0 5px;',
  },
}));

function Component({ navigate, tokens }) {
  const classes = useStyles();
  const [token, setToken] = React.useState(tokens[0].symbol);
  const [to, setTo] = React.useState();
  const [amount, setAmount] = React.useState();
  const [memo, setMemo] = React.useState();

  //   React.useEffect(
  //     function() {}, // eslint-disable-next-line react-hooks/exhaustive-deps
  //     []
  //   );

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    sl('warning', 'Work in progress', 'Info');
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      className={classes.root}
      fullWidth
    >
      <DialogTitle id="dialog-title">Transfer</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          Transfers are currently completely free, so go wild!
        </DialogContentText>
        <div style={{ marginBottom: 20 }}>
          <div className={classes.rowHeading}>Asset *</div>
          <Select
            value={token}
            onChange={event => setToken(event.target.value)}
            fullWidth
          >
            {tokens.map(c => (
              <MenuItem key={c.symbol} value={c.symbol}>
                {c.symbol} - {c.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <TextField
            id="to"
            label="Recipient Ethereum Address/ENS Name"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={''}
            value={to}
            onChange={e => setTo(e.target.value)}
            fullWidth
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <TextField
            id="amount"
            label="Recipient Ethereum Address/ENS Name"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'0.000'}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex flex--justify-center">
          <TextField
            id="memo"
            label="Memo"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={''}
            value={memo}
            onChange={e => setMemo(e.target.value)}
            fullWidth
            rows="2"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(({ exchange: { tokens } }) => {
  return {
    tokens,
  };
}, mapDispatchToProps)(Component);
