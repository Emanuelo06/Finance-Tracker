"use client";
import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/');
    }
  }, [user, router]);

  if (user === null) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;