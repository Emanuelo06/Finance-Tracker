"use client";
import type { Metadata } from "next";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";



export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider store={store}> 
        <body>
          {children}
        </body>
      </Provider>
    </html>
  );
}
