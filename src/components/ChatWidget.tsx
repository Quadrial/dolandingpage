// components/ChatWidget.tsx
import React from "react";
import { motion } from "framer-motion";
import { Client } from "@xmtp/browser-sdk";
import UserChat from "./UserChat";
import AdminInterface from "./AdminInterface";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  address?: string | null;
  adminAddress: string;
  isAdmin?: boolean; // Add optional isAdmin prop
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  client,
  address,
  adminAddress,
  isAdmin: isAdminProp, // Rename to avoid conflict
}) => {
  if (!isOpen) return null;

  // Use provided isAdmin prop if available, otherwise calculate it
  const isAdmin =
    isAdminProp !== undefined
      ? isAdminProp
      : !!address && address.toLowerCase() === adminAddress.toLowerCase();

  // Prevent propagation of events to background page
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-xl shadow-xl overflow-hidden z-50"
      onClick={handleContentClick}
      style={{ display: "flex", flexDirection: "column" }} // Ensure flexbox layout
    >
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center shrink-0">
        <h2 className="font-semibold">
          {isAdmin ? "Admin Dashboard" : "Live Chat"}
        </h2>
        <button onClick={onClose} className="text-white font-bold">
          ✕
        </button>
      </div>

      {/* Content area - takes remaining height */}
      <div className="flex-grow flex overflow-hidden">
        {client ? (
          isAdmin ? (
            <AdminInterface client={client} />
          ) : (
            <UserChat client={client} adminAddress={adminAddress} />
          )
        ) : (
          <div className="w-full flex items-center justify-center text-gray-500 p-4">
            Please connect your wallet to chat with support.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatWidget;
