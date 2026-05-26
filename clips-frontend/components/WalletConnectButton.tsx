"use client";

import React, { useState } from "react";
import { Loader2, Wallet, LogOut, AlertCircle, X, ChevronDown, Coins } from "lucide-react";
import { useWallet, truncateAddress } from "./WalletProvider";

interface WalletConnectButtonProps {
  /** Compact mode renders a smaller pill button (e.g. for headers/navbars) */
  compact?: boolean;
}

export default function WalletConnectButton({ compact = false }: WalletConnectButtonProps) {
  const {
    isConnected,
    isConnecting,
    address,
    walletType,
    error,
    balance,
    connectMetaMask,
    connectPhantom,
    connectStellar,
    disconnect,
    clearError,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getWalletIcon = (type: string | null) => {
    switch (type) {
      case "metamask":
        return "🦊";
      case "phantom":
        return "👻";
      case "stellar":
        return "⚡";
      default:
        return "💼";
    }
  };

  const getWalletName = (type: string | null) => {
    switch (type) {
      case "metamask":
        return "MetaMask";
      case "phantom":
        return "Phantom";
      case "stellar":
        return "Stellar";
      default:
        return "Wallet";
    }
  };

  if (compact) {
    return (
      <div className="relative flex flex-col items-end gap-2">
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 bg-brand/10 border border-brand/20 rounded-xl px-3.5 py-2">
              <span className="text-[13px]">{getWalletIcon(walletType)}</span>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[12px] font-mono font-bold text-brand">
                  {truncateAddress(address)}
                </span>
                {walletType === "stellar" && balance !== null && (
                  <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    {parseFloat(balance).toFixed(2)} XLM
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={disconnect}
              title="Disconnect wallet"
              aria-label="Disconnect wallet"
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition-all cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isConnecting}
              aria-label="Connect wallet menu"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-brand font-bold text-[13px] hover:bg-brand/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              {isConnecting ? "Connecting..." : "Connect Wallet"}
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0D1310] border border-[#1E2E25] rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    connectMetaMask();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] text-white text-[13px] font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>🦊</span> Connect MetaMask
                </button>
                <button
                  onClick={() => {
                    connectPhantom();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] text-white text-[13px] font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>👻</span> Connect Phantom
                </button>
                <button
                  onClick={() => {
                    connectStellar();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] text-brand text-[13px] font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>⚡</span> Connect Stellar (XLM)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Inline error toast */}
        {error && (
          <div className="absolute top-full mt-2 right-0 z-50 flex items-start gap-2 bg-red-950/85 border border-red-500/30 rounded-xl px-4 py-3 max-w-[280px] shadow-xl backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-300 leading-snug flex-1">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-200 transition-colors shrink-0 cursor-pointer" aria-label="Close error message">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full-size variant (used in platform cards / standalone pages)
  return (
    <div className="flex flex-col gap-3 w-full">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-950/60 border border-red-500/25 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-300 leading-snug flex-1">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-200 transition-colors shrink-0 cursor-pointer" aria-label="Close error message">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isConnected && address ? (
        <div className="space-y-3 w-full">
          <div className="w-full p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getWalletIcon(walletType)}</span>
              <div>
                <p className="text-[14px] font-bold text-white">{getWalletName(walletType)} Connected</p>
                <p className="text-[12px] font-mono text-muted-foreground">{address}</p>
                {walletType === "stellar" && balance !== null && (
                  <p className="text-[12px] text-brand font-bold mt-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {parseFloat(balance).toFixed(4)} XLM
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={disconnect}
            aria-label="Disconnect wallet"
            className="w-full py-3.5 rounded-xl font-bold text-[14px] bg-transparent border border-white/10 text-white hover:bg-red-950/20 hover:border-red-500/20 hover:text-red-400 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Disconnect {getWalletName(walletType)}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 w-full">
          <button
            onClick={connectMetaMask}
            disabled={isConnecting}
            aria-label="Connect MetaMask wallet"
            className="w-full py-3.5 rounded-xl font-bold text-[14px] bg-[#1E2622] hover:bg-[#2A3731] border border-white/10 text-white transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>🦊</span>
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </button>
          <button
            onClick={connectPhantom}
            disabled={isConnecting}
            aria-label="Connect Phantom wallet"
            className="w-full py-3.5 rounded-xl font-bold text-[14px] bg-[#1E2622] hover:bg-[#2A3731] border border-white/10 text-white transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>👻</span>
            {isConnecting ? "Connecting..." : "Connect Phantom"}
          </button>
          <button
            onClick={connectStellar}
            disabled={isConnecting}
            aria-label="Connect Stellar wallet"
            className="w-full py-3.5 rounded-xl font-bold text-[14px] bg-brand hover:bg-brand-hover text-black shadow-[0_0_20px_rgba(0,229,143,0.15)] hover:shadow-[0_0_35px_rgba(0,229,143,0.3)] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>⚡</span>
            {isConnecting ? "Connecting..." : "Connect Stellar (XLM)"}
          </button>
        </div>
      )}
    </div>
  );
}
