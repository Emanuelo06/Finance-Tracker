// src/app/AuthProvider.tsx
"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearAuthErrors } from "@/redux/slices/authSlice";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        }));
        dispatch(clearAuthErrors());
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe(); // cleanup
  }, [dispatch]);

  return <>{children}</>;
};
