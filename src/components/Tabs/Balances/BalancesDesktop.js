import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

export default ({ balances, balanceOnEthereumDict }) => (
  <TableContainer>
    <Table size="small" aria-label="bets">
      <TableHead>
        <TableRow>
          <TableCell>Asset</TableCell>
          <TableCell align="right">Balance on Ethereum</TableCell>
          <TableCell align="right">Balance on Loopring</TableCell>
          <TableCell align="right">Available Balance</TableCell>
          <TableCell align="right">Operations</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {balances.map(balance => (
          <TableRow key={balance.token.symbol}>
            <TableCell component="th" scope="row">
              <span>
                {balance.token.symbol} - {balance.token.name}
                {/* <I s={balance.token.name} /> */}
              </span>
            </TableCell>
            <TableCell align="right">
              {balanceOnEthereumDict[balance.token.symbol]}
            </TableCell>
            <TableCell align="right">{balance.totalAmountInString}</TableCell>
            <TableCell align="right">{balance.availableInAssetPanel}</TableCell>
            <TableCell align="right">
              <div className="flex">
                <Link to={'/balances/transfer'}>
                  <Button size="small" color="secondary">
                    Transfer
                  </Button>
                </Link>
                <Link to={'/balances/deposit'}>
                  <Button size="small" color="default">
                    Deposit
                  </Button>
                </Link>
                <Link to={'/balances/withdraw'}>
                  <Button size="small" color="default">
                    Withdraw
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
