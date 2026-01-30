import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setUser, setIsAuthenticated, setLoading } from '../redux/slices/authSlice';
import { useGetCurrentUserQuery } from '../redux/api/authApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    // Only run this query once on mount
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }

    if (isError || !data) {
      // User not authenticated
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
      dispatch(setLoading(false));
      return;
    }

    // User is authenticated
    dispatch(setUser({
      username: data.username,
      email: data.email,
      role: data.role,
      employeeId: data.employeeId,
    }));
    dispatch(setIsAuthenticated(true));
    dispatch(setLoading(false));
  }, [data, isLoading, isError, dispatch]);

  return <>{children}</>;
}