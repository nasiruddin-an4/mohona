'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteSettingsContext = createContext({
  settings: null,
  loading: true,
  error: null,
  refreshSettings: () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    storeName: 'Mohona by CGFWA',
    phone: '01769-441085',
    phoneAlt: '+880 1769-441085',
    email: 'cgfwatreasurer@gmail.com',
    address: 'দোকান # ১,২ নেভী মার্কেট, খিলক্ষেত, ঢাকা-১২২৯, Dhaka, Bangladesh',
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
