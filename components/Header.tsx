'use client';

import { useState } from 'react';
import { Menu, Bell, Settings2, User } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-card rounded-card p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-islamic-green to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">د</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">DuaFlow</h1>
            <p className="text-sm text-muted">Never miss a spiritual practice</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-muted hover:text-text hover:bg-gray-100 rounded-button transition-all duration-200">
            <Bell className="w-5 h-5" />
          </button>
          
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-90 rounded-button border border-gray-200 hover:bg-opacity-100 transition-all duration-200">
                <Avatar className="w-6 h-6" />
                <Name className="text-sm font-medium" />
              </div>
            </ConnectWallet>
          </Wallet>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-muted hover:text-text hover:bg-gray-100 rounded-button transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-gray-100 rounded-button transition-all duration-200">
              <User className="w-4 h-4" />
              Profile
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-text hover:bg-gray-100 rounded-button transition-all duration-200">
              <Settings2 className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
