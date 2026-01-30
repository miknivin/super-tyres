import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./slices/authSlice";
import serviceEnquiryReducer from "./slices/serviceEnquiryFormSlice";
import { servicesApi } from "./api/servicesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceEnquiry: serviceEnquiryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, servicesApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
