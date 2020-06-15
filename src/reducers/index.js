import { combineReducers } from 'redux';
import * as asyncInitialState from 'redux-async-initial-state';
import app from './app';
// import data from './data';
import wallet from './wallet';

export default asyncInitialState.outerReducer(
  combineReducers({
    app,
    // data,
    wallet,
    asyncInitialState: asyncInitialState.innerReducer, // last
  })
);
