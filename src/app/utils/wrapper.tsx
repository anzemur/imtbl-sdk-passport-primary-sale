'use client';
import { BiomeCombinedProviders, Stack } from '@biom3/react';
import { PassportProvider } from '../../context/passport';

export default function AppWrapper({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex-container">
          <PassportProvider>
          <BiomeCombinedProviders>
              <Stack alignItems="center">
                { children }
              </Stack>
          </BiomeCombinedProviders>
          </PassportProvider>
    </div>
    );
}