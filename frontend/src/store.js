import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { musicRecommenderApi } from "./api";

export const store = configureStore({
  reducer: {
    [musicRecommenderApi.reducerPath]: musicRecommenderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(musicRecommenderApi.middleware),
});

setupListeners(store.dispatch);
