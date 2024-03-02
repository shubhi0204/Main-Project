// import { combineReducers, applyMiddleware } from "redux";

// import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import { thunk } from "redux-thunk";

// const reducer = combineReducers({});
// let initialState = {};
// const middleware = [thunk];

// const store = configureStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './Features/ui';


const store = configureStore({
    reducer: {
        ui: uiReducer,
        
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(doctorApi.middleware),
});

export default store;
