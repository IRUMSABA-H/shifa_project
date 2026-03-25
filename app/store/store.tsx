import { configureStore } from "@reduxjs/toolkit";
import { ShifaApi } from "./services/shifaapi";
import { setupListeners } from "@reduxjs/toolkit/query";


const store = configureStore({
  reducer: {
    [ShifaApi.reducerPath]: ShifaApi.reducer
  },
  middleware:(getDefaultmiddleware)=>getDefaultmiddleware().concat(ShifaApi.middleware)
});

export default store;

setupListeners(store.dispatch)