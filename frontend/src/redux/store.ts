import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./slices/authSlice";
import serviceEnquiryReducer from "./slices/serviceEnquiryFormSlice";
import { servicesApi } from "./api/servicesApi";
import { designationsApi } from "./api/designationApi";
import { usersApi } from "./api/userApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceEnquiry: serviceEnquiryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [designationsApi.reducerPath]: designationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      servicesApi.middleware,
      designationsApi.middleware,
      usersApi.middleware,
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
