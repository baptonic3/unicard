import { Magic } from './types';
import { Dispatch, SetStateAction } from 'react';

export type { LoginMethod } from './types';

export const logout = async (
  setToken: Dispatch<SetStateAction<string>>,
  magic: Magic | null
) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('loginMethod');
  localStorage.removeItem('pending_checkout');
  setToken('');
};

export const saveUserInfo = (
  token: string,
  loginMethod: string,
  userAddress: string
) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
  localStorage.setItem('user', userAddress);
};

export const getUserAddress = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user') || null;
};

export const getToken = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
};

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
