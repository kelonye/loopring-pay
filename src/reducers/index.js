import { combineReducers } from 'redux';
// import { connectRouter } from 'connected-react-router';

// import { CmcPriceReducer } from './CmcPrice';
import { DexAccountReducer } from './DexAccount';
import { ExchangeInfoReducer } from './ExchangeInfo';
// import { GasPriceReducer } from './GasPrice';
// import { LayoutManagerReducer } from './LayoutManager';
// import { LiquidityMiningReducer } from './LiquidityMining';
import { MetaMaskReducer } from './MetaMask';
// import { ModalManagerReducer } from './ModalManager';
import { MyAccountPageReducer } from './MyAccountPage';
// import { MyOrderPageReducer } from './MyOrderPage';
// import { MyOrdersReducer } from './MyOrders';
// import { NonceReducer } from './Nonce';
// import { TabsReducer } from './Tabs';
// import { TradePanelReducer } from './TradePanel';
// import { UserPreferenceManagerReducer } from './UserPreferenceManager';
// import { WalletConnectReducer } from './WalletConnect';

// markets
// import { CurrentMarketReducer } from './market/CurrentMarket';
// import { NotifyCenterReducer } from './NotifyCenter';
// import { OrderBookReducer } from './market/OrderBook';
// import { TickerReducer } from './market/Ticker';
// import { TradeHistoryReducer } from './market/TradeHistory';

// custom
import * as asyncInitialState from 'redux-async-initial-state';
import app from './custom/app';
// import data from './data';
import wallet from './custom/wallet';

const rootReducer = history =>
  combineReducers({
    // router: connectRouter(history),
    exchange: ExchangeInfoReducer,
    // tabs: TabsReducer,
    // tradePanel: TradePanelReducer,
    // layoutManager: LayoutManagerReducer,
    // liquidityMining: LiquidityMiningReducer,
    // // TODO: Refactor market in redux
    // market: combineReducers({
    //   currentMarket: CurrentMarketReducer,
    //   orderBook: OrderBookReducer,
    //   tradeHistory: TradeHistoryReducer,
    //   ticker: TickerReducer,
    // }),
    // currentMarket: CurrentMarketReducer,
    // orderBook: OrderBookReducer,
    // tradeHistory: TradeHistoryReducer,
    // ticker: TickerReducer,
    // modalManager: ModalManagerReducer,
    balances: MyAccountPageReducer,
    // myOrders: MyOrdersReducer,
    // myOrderPage: MyOrderPageReducer,
    metaMask: MetaMaskReducer,
    // walletConnect: WalletConnectReducer,
    dexAccount: DexAccountReducer,
    // nonce: NonceReducer,
    // gasPrice: GasPriceReducer,
    // cmcPrice: CmcPriceReducer,
    // userPreferences: UserPreferenceManagerReducer,
    // notifyCenter: NotifyCenterReducer,
    //
    app,
    // data,
    wallet,
    asyncInitialState: asyncInitialState.innerReducer, // last
  });

export default rootReducer;
