"use client";
import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { isTokenExpiringSoon, getTokenExpirationTime } from '../utils/jwt';

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  lastActivity: number;
}

export const useSession = () => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    lastActivity: Date.now(),
  });

  const checkAuthStatus = useCallback(async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setSessionState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      return;
    }

    try {
      // Check if token is valid
      const expTime = getTokenExpirationTime(accessToken);
      const now = Math.floor(Date.now() / 1000);
      
      if (expTime && expTime > now) {
        // Token is still valid
        setSessionState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: Date.now(),
        }));
      } else {
        // Token expired, try to refresh
        await refreshSession();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setSessionState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = Cookies.get('refresh_token');
    
    if (!refreshToken) {
      setSessionState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('refresh_token', refreshToken);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, refresh_token } = data;
        
        // Update cookies
        const rememberMe = Cookies.get('rememberMe') === 'true';
        const email = Cookies.get('email') || '';
        
        Cookies.set('access_token', access_token, {
          expires: rememberMe ? 1 : 1,
          secure: process.env.NEXT_PUBLIC_PRODUCTION === 'production',
          sameSite: 'lax',
          path: '/',
        });
        
        Cookies.set('refresh_token', refresh_token, {
          expires: rememberMe ? 30 : 7,
          secure: process.env.NEXT_PUBLIC_PRODUCTION === 'production',
          sameSite: 'lax',
          path: '/',
        });

        setSessionState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: Date.now(),
        }));
      } else {
        throw new Error('Refresh failed');
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      // Clear cookies and redirect to login
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('email');
      
      setSessionState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      
      window.location.href = '/';
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('email');
    Cookies.remove('rememberMe');
    
    setSessionState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      lastActivity: Date.now(),
    });
    
    window.location.href = '/';
  }, []);

  const updateActivity = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      lastActivity: Date.now(),
    }));
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Set up activity tracking
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check for token expiration every 5 minutes
    const interval = setInterval(() => {
      const accessToken = Cookies.get('access_token');
      if (accessToken && isTokenExpiringSoon(accessToken)) {
        refreshSession();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [updateActivity, refreshSession]);

  return {
    ...sessionState,
    refreshSession,
    logout,
    updateActivity,
  };
}; 