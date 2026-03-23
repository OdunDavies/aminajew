"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Currency = "NGN" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatPrice: (priceInNaira: number) => string;
}

const EXCHANGE_RATE = Number(process.env.NEXT_PUBLIC_NGN_USD_RATE ?? 1600);

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === "NGN" ? "USD" : "NGN"));
  }, []);

  const formatPrice = useCallback(
    (priceInNaira: number) => {
      if (currency === "NGN") {
        return `₦${priceInNaira.toLocaleString()}`;
      }
      const usd = priceInNaira / EXCHANGE_RATE;
      return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
