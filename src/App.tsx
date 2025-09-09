import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DomainSearch from "./components/DomainSearch";
import FeaturedDomains from "./components/FeaturedDomains";
import Promotions from "./components/Promotions";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { FaCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";

import { Client } from "@xmtp/browser-sdk";
import { type WalletClient } from "viem";
import { createWalletSigner } from "./utils/walletSigner";

const ADMIN_ADDRESS = "0x1dcb5a1c5fa7571860926ff8f09ea959c49d3461";

function App() {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [address, setAddress] = useState<string | null>(null); // ⭐ track address
  const [client, setClient] = useState<Client | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onConnect = async (wc: WalletClient) => {
    setWalletClient(wc);

    // get the address explicitly
    const accounts = await wc.getAddresses();
    if (accounts[0]) setAddress(accounts[0]);
  };

  // Init XMTP when wallet connected
  useEffect(() => {
    const initXMTP = async () => {
      if (walletClient && address && !client) {
        const signer = createWalletSigner(walletClient);
        const xmtp = await Client.create(signer, { env: "production" });
        setClient(xmtp);
      }
    };
    initXMTP();
  }, [walletClient, address]);

  return (
    <div className="App bg-gray-50 min-h-screen">
      <Header address={address} onConnect={onConnect} />
      <Hero />
      <DomainSearch />
      <FeaturedDomains />
      <Promotions />
      <Features />
      <Testimonials />
      <Footer />

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg focus:outline-none z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaCommentDots size={24} />
      </motion.button>

      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        client={client}
        address={address} // ⭐ pass it here
        adminAddress={ADMIN_ADDRESS}
      />
    </div>
  );
}

export default App;
