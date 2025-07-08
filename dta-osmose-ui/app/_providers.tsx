"use client";

import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "./[institution]/(auth)/sign-in/context/authContext";
import { NotificationProvider } from "./[institution]/(auth)/sign-in/context/NotificationContext";
import store from "@/redux/store";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
