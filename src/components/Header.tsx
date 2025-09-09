// Header.tsx
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { type WalletClient } from "viem";
import WalletConnector from "./WalletConnector";

interface HeaderProps {
  address: string | null; // ⭐ added
  onConnect: (wc: WalletClient) => void;
}

const Header: React.FC<HeaderProps> = ({ address, onConnect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-3)}` : "";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">DOMAIN.</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">
            HOME
          </a>
          <a href="#" className="text-blue-600 font-medium">
            DOMAIN
          </a>
          <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">
            PLAN
          </a>
          <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">
            SUPPORT
          </a>
        </div>

        {/* Right: wallet connect / address */}
        <div className="hidden md:flex items-center">
          {address ? (
            <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 font-medium">
              {formatAddress(address)}
            </div>
          ) : (
            <WalletConnector onConnect={onConnect} />
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        className="md:hidden bg-white px-4 pb-4"
      >
        <a href="#" className="block py-2">
          HOME
        </a>
        <a href="#" className="block py-2">
          DOMAIN
        </a>
        <a href="#" className="block py-2">
          PLAN
        </a>
        <a href="#" className="block py-2">
          SUPPORT
        </a>

        <div className="mt-4 pt-4 border-t border-gray-200">
          {address ? (
            <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 font-medium">
              {formatAddress(address)}
            </div>
          ) : (
            <WalletConnector onConnect={onConnect} />
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Header;
