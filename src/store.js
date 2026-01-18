import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice";
import userReducer from "./Slices/userSlice";
import depositReducer from "./Slices/depositSlice";
import betReducer from "./Slices/betSlice";
import withdrawalReducer from "./Slices/withdrawalSlice";
import balanceReducer from "./Slices/balanceSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        deposits: depositReducer,
        bets: betReducer,
        withdrawals: withdrawalReducer,
        balances: balanceReducer,
    },
});
    
export default store;