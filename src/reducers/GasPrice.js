import { UPDATE_GAS_PRICE } from 'actions/GasPrice';

const initialState = {
  gasPrice: [],
};

export const GasPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GAS_PRICE:
      const gasPrice = action.payload.gasPrice;
      return {
        ...state,
        gasPrice,
      };
    default:
      return state;
  }
};
