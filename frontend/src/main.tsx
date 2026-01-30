import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import AuthProvider from "./providers/AuthProvider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Toaster position="top-right" />
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
