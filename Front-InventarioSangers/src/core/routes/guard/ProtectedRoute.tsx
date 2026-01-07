import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};