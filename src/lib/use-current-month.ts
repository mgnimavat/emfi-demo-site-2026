'use client';

import { useSyncExternalStore } from 'react';

const refreshInterval = 60_000;
const getCurrentMonth = () => {
  const now = new Date(Date.now());
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
const getServerMonth = () => '';
const subscribe = (notify: () => void) => {
  const timer = window.setInterval(notify, refreshInterval);
  window.addEventListener('focus', notify);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener('focus', notify);
  };
};

export const useCurrentMonth = () => useSyncExternalStore(subscribe, getCurrentMonth, getServerMonth);
