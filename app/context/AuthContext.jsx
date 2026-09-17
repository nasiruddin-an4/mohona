'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isManager = user?.role === 'OUTLET_MANAGER';
  const isStaff = user?.role === 'OUTLET_STAFF';

  return (
    <AuthContext.Provider value={{ user, loading, isSuperAdmin, isManager, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
