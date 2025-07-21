"use client";
import type { Metadata } from "next";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";



export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
        <Provider store={store}> 
          <AuthProvider>
          <body>
            {children}
          </body>
          </AuthProvider>
        </Provider>
      
    </html>
  );
}
