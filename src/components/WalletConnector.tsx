// import { useConnect } from "wagmi";
// import { getWalletClient } from "wagmi/actions";
// import { useState } from "react";
// import { type WalletClient } from "viem";
// import { type Connector } from "wagmi";
// import { config } from "../main";

// interface WalletConnectorProps {
//   onConnect: (walletClient: WalletClient) => void;
// }

// function WalletConnector({ onConnect }: WalletConnectorProps) {
//   const { connect, connectors, isPending } = useConnect();
//   const [error, setError] = useState<string | null>(null);

//   const handleConnect = async (connector: Connector) => {
//     try {
//       setError(null);
//       await connect({ connector });
//       const walletClient = await getWalletClient(config);
//       if (walletClient) {
//         onConnect(walletClient);
//       }
//     } catch (err) {
//       console.error("Failed to connect wallet:", err);
//       setError("Failed to connect wallet. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <h2 className="text-xl">Connect your wallet</h2>
//       {error && <div className="text-red-500">{error}</div>}
//       <button
//         onClick={() => handleConnect(connectors[0])}
//         disabled={isPending || connectors.length === 0}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
//       >
//         {isPending ? "Connecting..." : "Connect Wallet"}
//       </button>
//     </div>
//   );
// }

// export default WalletConnector;

// src/components/WalletConnector.tsx
import React, { useState } from "react";
import { createWalletClient, custom } from "viem";
// Import the chain(s) you intend to use. For example, mainnet:
import { mainnet } from "viem/chains"; // or other chains like sepolia, arbitrum, etc.

// Define the expected type for the wallet client
import { type WalletClient } from "viem";

interface WalletConnectorProps {
  onConnect: (walletClient: WalletClient) => void;
  // Optional: You can add props for styling if needed, but we'll use Header's styling
  className?: string;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({
  onConnect,
  className,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask or other Ethereum wallet not detected! Please install it."
        );
      }

      // Create a Viem wallet client using window.ethereum
      const walletClient = createWalletClient({
        chain: mainnet, // Set your desired chain here (e.g., mainnet, sepolia)
        transport: custom(window.ethereum),
      });

      // Request account access from the user
      // This will prompt MetaMask/wallet to connect if not already
      const [address] = await walletClient.requestAddresses();

      if (address) {
        onConnect(walletClient); // Pass the connected walletClient back to the parent
      } else {
        setError("No address selected or connection cancelled.");
      }
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      // More user-friendly error messages
      if (err.code === 4001) {
        // User rejected request
        setError("Wallet connection cancelled by user.");
      } else {
        setError(err.message || "Failed to connect wallet. Please try again.");
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        disabled={connecting}
        className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition ${className}`}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default WalletConnector;
