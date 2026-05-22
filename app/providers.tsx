"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
