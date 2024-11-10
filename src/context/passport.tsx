/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  createContext, ReactNode, useCallback, useContext,
  useMemo,
} from 'react';
import { config, passport } from '@imtbl/sdk';
import { ethers } from 'ethers';

type PassportContextType = {
  passportInstance?: passport.Passport;
  passportSilentInstance?: passport.Passport;
  login?: () => void;
  logout?: () => void;
  logoutSilent?: () => void;
  loginWithoutWallet?: () => void;
  loginWithEthersjs?: () => void;
  getIdToken?: () => void;
  getAccessToken?: () => void;
  getLinkedAddresses?: () => void;
  getUserInfo?: () => void;
};

const PassportContext = createContext<PassportContextType>({});

export function PassportProvider({ children }: { children: ReactNode }) {
  // #doc passport-instance
  const passportInstance = new passport.Passport({
    baseConfig: {
      environment: config.Environment.SANDBOX,
    },
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    redirectUri: 'http://localhost:3000/login-redirect',
    audience: 'platform_api',
    scope: 'openid offline_access email transact'
  });


  const login = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-evm-login
    const provider = passportInstance.connectEvm();
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    // #enddoc passport-evm-login
    window.alert(`accounts: ${accounts}`);
  }, [passportInstance]);

  const logout = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-logout
    await passportInstance.logout();
    // #enddoc passport-logout
  }, [passportInstance]);


  const loginWithoutWallet = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-login-without-wallet
    const profile: passport.UserProfile | null = await passportInstance.login();
    // #enddoc passport-login-without-wallet
    window.alert(`profile: ${JSON.stringify(profile)}`);
  }, [passportInstance]);

  const loginWithEthersjs = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-login-with-ethersjs
    const passportProvider = passportInstance.connectEvm();

    const web3Provider = new ethers.providers.Web3Provider(passportProvider);

    const accounts = await web3Provider.send('eth_requestAccounts', []);
    // #enddoc passport-login-with-ethersjs

    const signer = web3Provider.getSigner();

    window.alert(
      `accounts: ${accounts} signer: ${JSON.stringify(signer)}`,
    );
  }, [passportInstance]);

  const getIdToken = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-get-id-token
    const idToken = await passportInstance.getIdToken();
    // #enddoc passport-get-id-token
    window.alert(`idToken: ${idToken}`);
  }, [passportInstance]);

  const getAccessToken = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-get-access-token
    const accessToken = await passportInstance.getAccessToken();
    // #enddoc passport-get-access-token
    window.alert(`accessToken: ${accessToken}`);
  }, [passportInstance]);

  const getLinkedAddresses = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-get-linked-addresses
    const linkedAddresses = await passportInstance.getLinkedAddresses();
    // #enddoc passport-get-linked-addresses
    window.alert(`linkedAddresses: ${linkedAddresses}`);
  }, [passportInstance]);

  const getUserInfo = useCallback(async () => {
    if (!passportInstance) return;
    // #doc passport-get-user-info
    const userProfile = await passportInstance.getUserInfo();
    // #enddoc passport-get-user-info
    window.alert(`userProfile: ${JSON.stringify(userProfile)}`);
  }, [passportInstance]);

  const providerValue = useMemo(() => ({
    passportInstance,
    login,
    logout,
    loginWithoutWallet,
    loginWithEthersjs,
    getIdToken,
    getAccessToken,
    getLinkedAddresses,
    getUserInfo,
  }), [
    passportInstance,
    login,
    logout,
    loginWithoutWallet,
    loginWithEthersjs,
    getIdToken,
    getAccessToken,
    getLinkedAddresses,
    getUserInfo,
  ]);

  return (
    <PassportContext.Provider value={providerValue}>
      {children}
    </PassportContext.Provider>
  );
}

export const usePassport = () => useContext(PassportContext);
