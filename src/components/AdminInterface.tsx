

import { useState, useEffect, useRef } from "react";
import {
  Client,
  Dm,
  DecodedMessage,
} from "@xmtp/browser-sdk";

interface AdminInterfaceProps {
  client: Client;
}

interface ConversationData {
  dm: Dm;
  messages: DecodedMessage[];
  userAddress: string;
  lastMessage?: DecodedMessage;
}

const renderMessageContent = (content: any): string => {
  if (typeof content === "string") return content;
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
};

const isDecodedMessage = (item: any): item is DecodedMessage =>
  item && typeof item === "object" && "id" in item && "content" in item;

function AdminInterface({ client }: AdminInterfaceProps) {
  const [conversations, setConversations] = useState<
    Map<string, ConversationData>
  >(new Map());
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load conversations and live stream updates
  useEffect(() => {
    let alive = true;
    const setup = async () => {
      try {
        const all = await client.conversations.list();
        for (const conv of all) {
          if (!(conv instanceof Dm)) continue;
          const peer = await conv.peerInboxId();
          const msgs = (await conv.messages()).filter(isDecodedMessage);

          setConversations((prev) => {
            const m = new Map(prev);
            m.set(conv.id, {
              dm: conv,
              messages: msgs,
              userAddress: peer,
              lastMessage: msgs.at(-1),
            });
            return m;
          });

          // stream new messages
          (async () => {
            const stream = await conv.stream();
            for await (const item of stream) {
              if (!alive) break;
              if (!isDecodedMessage(item)) continue;
              setConversations((prev) => {
                const m = new Map(prev);
                const ex = m.get(conv.id);
                if (ex && !ex.messages.some((mg) => mg.id === item.id)) {
                  m.set(conv.id, {
                    ...ex,
                    messages: [...ex.messages, item],
                    lastMessage: item,
                  });
                }
                return m;
              });
            }
          })();
        }
      } catch (e) {
        console.error("Admin load error:", e);
        if (alive) setError("Failed to load conversations.");
      }
    };
    setup();
    return () => {
      alive = false;
    };
  }, [client]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Prevent propagation
  const preventPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const sendMessage = async () => {
    if (!selectedConvId || !message.trim() || isSending) return;
    const convo = conversations.get(selectedConvId);
    if (!convo) return;
    try {
      setIsSending(true);
      await convo.dm.send(message);
      setMessage("");
      const updated = (await convo.dm.messages()).filter(isDecodedMessage);
      setConversations((prev) => {
        const m = new Map(prev);
        m.set(selectedConvId, {
          ...convo,
          messages: updated,
          lastMessage: updated.at(-1),
        });
        return m;
      });
      setTimeout(scrollToBottom, 100);
    } catch (e) {
      console.error("send error:", e);
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedConv = selectedConvId
    ? conversations.get(selectedConvId)
    : null;

  // Prevent wheel events from propagating outside
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent the wheel event from propagating to parent elements
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
  }, [selectedConvId]); // Re-add when conversation changes

  // Helper function to format the user's address nicely
  const formatUserAddress = (address: string) => {
    if (!address) return "User";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white flex-col overflow-hidden">
      {!selectedConv ? (
        // Conversation list
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          onScroll={preventPropagation}
          onClick={preventPropagation}
        >
          {Array.from(conversations.values())
            .sort(
              (a, b) =>
                (b.lastMessage?.sentAtNs ? Number(b.lastMessage.sentAtNs) : 0) -
                (a.lastMessage?.sentAtNs ? Number(a.lastMessage.sentAtNs) : 0)
            )
            .map((c) => (
              <div
                key={c.dm.id}
                className="p-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800"
                onClick={() => setSelectedConvId(c.dm.id)}
              >
                <div className="font-medium">
                  {formatUserAddress(c.userAddress)}
                </div>
                {c.lastMessage && (
                  <div className="text-xs text-gray-400 truncate">
                    {renderMessageContent(c.lastMessage.content)}
                  </div>
                )}
              </div>
            ))}
          {conversations.size === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      ) : (
        // Chat view - Fixed layout structure
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Header - fixed at top */}
          <div
            className="flex items-center gap-2 p-3 border-b border-gray-700 bg-gray-800"
            style={{ flexShrink: 0 }}
          >
            <button
              className="text-white font-bold text-lg hover:text-blue-400"
              onClick={() => setSelectedConvId(null)}
            >
              ← Back
            </button>
            <span className="font-medium">
              {formatUserAddress(selectedConv.userAddress)}
            </span>
          </div>

          {/* Scrollable messages - takes available space */}
          <div
            ref={messagesContainerRef}
            className="p-3 space-y-2 bg-gray-900"
            style={{
              flexGrow: 1,
              overflowY: "auto",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch", // Better iOS scrolling
              height: "100%",
            }}
            onScroll={preventPropagation}
            onClick={preventPropagation}
          >
            {selectedConv.messages.map((m) => {
              const mine = m.senderInboxId === client.inboxId;
              return (
                <div
                  key={m.id}
                  className={`flex ${
                    mine ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg break-words ${
                      mine ? "bg-blue-600" : "bg-gray-700"
                    } max-w-[80%]`}
                  >
                    {/* Added sender identifier */}
                    <div className="font-medium text-xs mb-1">
                      {mine
                        ? "Admin (You)"
                        : formatUserAddress(selectedConv.userAddress)}
                    </div>

                    {renderMessageContent(m.content)}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {new Date(
                        Number(m.sentAtNs / 1000000n)
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {selectedConv.messages.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No messages yet. Send the first message!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed input bar - always at bottom */}
          <div
            className="p-2 border-t border-gray-700 flex gap-2 bg-gray-800"
            style={{ flexShrink: 0 }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
              placeholder="Type a message..."
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendMessage();
              }}
              disabled={isSending}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-50 whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="p-2 text-red-400 bg-red-900/20 text-center text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default AdminInterface;
