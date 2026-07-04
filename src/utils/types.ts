import { Dispatch, SetStateAction } from 'react';

export type LoginProps = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

export type LoginMethod = 'EMAIL' | 'SOCIAL' | 'FORM';

export type { Magic } from '../hooks/MagicProvider';
