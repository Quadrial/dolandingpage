// import { useState, useEffect, useRef } from "react";
// import {
//   Client,
//   Dm,
//   DecodedMessage,
//   type Identifier,
//   type IdentifierKind,
// } from "@xmtp/browser-sdk";

// interface UserChatProps {
//   client: Client;
//   adminAddress: string;
// }

// function isDecodedMessage(item: any): item is DecodedMessage {
//   return (
//     item &&
//     typeof item === "object" &&
//     "id" in item &&
//     "senderInboxId" in item &&
//     "sentAtNs" in item &&
//     "content" in item
//   );
// }

// export default function UserChat({ client, adminAddress }: UserChatProps) {
//   const [conversation, setConversation] = useState<Dm | null>(null);
//   const [messages, setMessages] = useState<DecodedMessage[]>([]);
//   const [message, setMessage] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Setup DM with Admin when client ready
//   useEffect(() => {
//     const initConversation = async () => {
//       if (!client) return;
//       try {
//         const adminIdentifier: Identifier = {
//           identifier: adminAddress,
//           identifierKind: "Ethereum" as IdentifierKind,
//         };
//         const dm = await client.conversations.newDmWithIdentifier(
//           adminIdentifier
//         );
//         setConversation(dm);
//       } catch (err) {
//         setError("Failed to start conversation with admin.");
//       }
//     };
//     initConversation();
//   }, [client, adminAddress]);

//   // Load messages + stream new ones
//   useEffect(() => {
//     if (!conversation) return;
//     let isMounted = true;
//     (async () => {
//       try {
//         const initial = await conversation.messages();
//         if (isMounted) setMessages(initial.filter(isDecodedMessage));
//         const stream = await conversation.stream();
//         for await (const msg of stream) {
//           if (!isMounted) break;
//           if (isDecodedMessage(msg)) {
//             setMessages((prev) =>
//               prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
//             );
//           }
//         }
//       } catch (err) {
//         setError("Error streaming messages.");
//       }
//     })();
//     return () => {
//       isMounted = false;
//     };
//   }, [conversation]);

//   // Scroll to bottom only when sending a message
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Prevent propagation
//   const preventPropagation = (e: React.UIEvent) => {
//     e.stopPropagation();
//   };

//   // Add wheel event handler to prevent page scrolling
//   useEffect(() => {
//     const handleWheel = (e: WheelEvent) => {
//       e.stopPropagation();
//     };

//     // Add the event listener to the container
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.addEventListener("wheel", handleWheel, { passive: false });
//     }

//     // Cleanup
//     return () => {
//       if (container) {
//         container.removeEventListener("wheel", handleWheel);
//       }
//     };
//   }, [conversation]); // Re-add when conversation changes

//   const sendMessage = async () => {
//     if (!conversation || !message.trim() || isSending) return;
//     try {
//       setIsSending(true);
//       await conversation.send(message);
//       setMessage("");
//       const updated = await conversation.messages();
//       setMessages(updated.filter(isDecodedMessage));
//       setTimeout(scrollToBottom, 100);
//     } catch (err) {
//       setError("Failed to send message.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="flex h-full w-full bg-gray-900 text-white flex-col overflow-hidden">
//       {/* Fixed layout with flexbox */}
//       <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//         {/* Messages - scrollable area */}
//         <div
//           ref={messagesContainerRef}
//           className="p-4 space-y-3 bg-gray-900"
//           style={{
//             flexGrow: 1,
//             overflowY: "auto",
//             overflowX: "auto",
//             WebkitOverflowScrolling: "touch",
//           }}
//           onScroll={preventPropagation}
//           onClick={preventPropagation}
//         >
//           {messages.length === 0 ? (
//             <div className="text-center text-gray-500 py-10">
//               Send a message to start the conversation.
//             </div>
//           ) : (
//             messages.map((msg) => {
//               const mine = msg.senderInboxId === client.inboxId;
//               return (
//                 <div
//                   key={msg.id}
//                   className={`flex ${mine ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`px-4 py-2 rounded-xl max-w-[80%] break-words ${
//                       mine ? "bg-blue-600 text-white" : "bg-gray-700"
//                     }`}
//                   >
//                     {String(msg.content)}
//                     <div className="text-xs text-gray-300 mt-1 text-right">
//                       {new Date(
//                         Number(msg.sentAtNs / 1000000n)
//                       ).toLocaleTimeString()}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input - fixed at bottom */}
//         <div className="p-3 bg-gray-800 flex gap-2" style={{ flexShrink: 0 }}>
//           <input
//             className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm"
//             placeholder="Write a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               sendMessage();
//             }}
//             disabled={!message.trim() || isSending}
//             className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50 text-sm whitespace-nowrap"
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="p-2 text-red-400 bg-red-900/20 text-center text-sm border-t border-red-900/30">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// components/UserChat.tsx
import { useState, useEffect, useRef } from "react";
import {
  Client,
  Dm,
  DecodedMessage,
  type Identifier,
  type IdentifierKind,
} from "@xmtp/browser-sdk";

interface UserChatProps {
  client: Client;
  adminAddress: string;
}

function isDecodedMessage(item: any): item is DecodedMessage {
  return (
    item &&
    typeof item === "object" &&
    "id" in item &&
    "senderInboxId" in item &&
    "sentAtNs" in item &&
    "content" in item
  );
}

export default function UserChat({ client, adminAddress }: UserChatProps) {
  const [conversation, setConversation] = useState<Dm | null>(null);
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Setup DM with Admin when client ready
  useEffect(() => {
    const initConversation = async () => {
      if (!client) return;
      try {
        const adminIdentifier: Identifier = {
          identifier: adminAddress,
          identifierKind: "Ethereum" as IdentifierKind,
        };
        const dm = await client.conversations.newDmWithIdentifier(
          adminIdentifier
        );
        setConversation(dm);
      } catch (err) {
        setError("Failed to start conversation with admin.");
      }
    };
    initConversation();
  }, [client, adminAddress]);

  // Load messages + stream new ones
  useEffect(() => {
    if (!conversation) return;
    let isMounted = true;
    (async () => {
      try {
        const initial = await conversation.messages();
        if (isMounted) setMessages(initial.filter(isDecodedMessage));
        const stream = await conversation.stream();
        for await (const msg of stream) {
          if (!isMounted) break;
          if (isDecodedMessage(msg)) {
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
            );
          }
        }
      } catch (err) {
        setError("Error streaming messages.");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [conversation]);

  // Scroll to bottom only when sending a message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Prevent propagation
  const preventPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  // Add wheel event handler to prevent page scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    // Add the event listener to the container
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [conversation]); // Re-add when conversation changes

  const sendMessage = async () => {
    if (!conversation || !message.trim() || isSending) return;
    try {
      setIsSending(true);
      await conversation.send(message);
      setMessage("");
      const updated = await conversation.messages();
      setMessages(updated.filter(isDecodedMessage));
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setError("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white flex-col overflow-hidden">
      {/* Fixed layout with flexbox */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Messages - scrollable area */}
        <div
          ref={messagesContainerRef}
          className="p-4 space-y-3 bg-gray-900"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={preventPropagation}
          onClick={preventPropagation}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Send a message to start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const mine = msg.senderInboxId === client.inboxId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[80%] break-words ${
                      mine ? "bg-blue-600 text-white" : "bg-gray-700"
                    }`}
                  >
                    {/* Added sender identifier */}
                    <div className="font-medium text-xs mb-1">
                      {mine ? "You" : "Admin Support"}
                    </div>

                    {String(msg.content)}
                    <div className="text-xs text-gray-300 mt-1 text-right">
                      {new Date(
                        Number(msg.sentAtNs / 1000000n)
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - fixed at bottom */}
        <div className="p-3 bg-gray-800 flex gap-2" style={{ flexShrink: 0 }}>
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendMessage();
            }}
            disabled={!message.trim() || isSending}
            className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50 text-sm whitespace-nowrap"
          >
            Send
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2 text-red-400 bg-red-900/20 text-center text-sm border-t border-red-900/30">
          {error}
        </div>
      )}
    </div>
  );
}
