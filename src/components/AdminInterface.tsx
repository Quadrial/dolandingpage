

import { useState, useEffect, useRef } from "react";
import { Client, Dm, DecodedMessage } from "@xmtp/browser-sdk";

interface AdminInterfaceProps {
  client: Client;
  onUnreadChange?: (count: number) => void;
}

interface ConversationData {
  dm: Dm;
  messages: DecodedMessage[];
  userAddress: string;
  lastMessage?: DecodedMessage;
  unreadCount?: number;
  lastAdminReplyAt?: number;
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

function AdminInterface({ client, onUnreadChange }: AdminInterfaceProps) {
  const [conversations, setConversations] = useState<
    Map<string, ConversationData>
  >(new Map());
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 🔔 whenever conversations change, calculate total unread
  useEffect(() => {
    if (onUnreadChange) {
      const totalUnread = Array.from(conversations.values()).reduce(
        (sum, c) => sum + (c.unreadCount ?? 0),
        0
      );
      onUnreadChange(totalUnread);
    }
  }, [conversations, onUnreadChange]);

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
              unreadCount: 0,
            });
            return m;
          });

          // stream messages in existing convs
          (async () => {
            const stream = await conv.stream();
            for await (const item of stream) {
              if (!alive) break;
              if (!isDecodedMessage(item)) continue;
              setConversations((prev) => {
                const m = new Map(prev);
                const ex = m.get(conv.id);
                if (ex && !ex.messages.some((mg) => mg.id === item.id)) {
                  const isMine = item.senderInboxId === client.inboxId;
                  const newUnread = isMine
                    ? ex.unreadCount ?? 0
                    : (ex.unreadCount ?? 0) + 1;
                  m.set(conv.id, {
                    ...ex,
                    messages: [...ex.messages, item],
                    lastMessage: item,
                    unreadCount: newUnread,
                    lastAdminReplyAt: isMine ? Date.now() : ex.lastAdminReplyAt,
                  });
                }
                return m;
              });
            }
          })();
        }

        // 🔴 Watch for brand new conversations
        (async () => {
          const convStream = await client.conversations.stream();
          for await (const newConv of convStream) {
            if (!alive || !(newConv instanceof Dm)) continue;

            const peer = await newConv.peerInboxId();
            const msgs = (await newConv.messages()).filter(isDecodedMessage);

            setConversations((prev) => {
              const m = new Map(prev);
              if (!m.has(newConv.id)) {
                m.set(newConv.id, {
                  dm: newConv,
                  messages: msgs,
                  userAddress: peer,
                  lastMessage: msgs.at(-1),
                  unreadCount: msgs.length > 0 ? 1 : 0,
                });
              }
              return m;
            });

            // start streaming new conv
            (async () => {
              const stream = await newConv.stream();
              for await (const item of stream) {
                if (!alive) break;
                if (!isDecodedMessage(item)) continue;
                setConversations((prev) => {
                  const m = new Map(prev);
                  const ex = m.get(newConv.id);
                  if (ex && !ex.messages.some((mg) => mg.id === item.id)) {
                    const isMine = item.senderInboxId === client.inboxId;
                    const newUnread = isMine
                      ? ex.unreadCount ?? 0
                      : (ex.unreadCount ?? 0) + 1;
                    m.set(newConv.id, {
                      ...ex,
                      messages: [...ex.messages, item],
                      lastMessage: item,
                      unreadCount: newUnread,
                      lastAdminReplyAt: isMine
                        ? Date.now()
                        : ex.lastAdminReplyAt,
                    });
                  }
                  return m;
                });
              }
            })();
          }
        })();
      } catch (e) {
        console.error("Admin load error:", e);
        if (alive) setError("Failed to load conversations");
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
          unreadCount: 0,
          lastAdminReplyAt: Date.now(),
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

  const formatUserAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "User";

  return (
    <div className="flex h-full w-full bg-gray-900 text-white flex-col overflow-hidden">
      {!selectedConv ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
                onClick={() => {
                  setSelectedConvId(c.dm.id);
                  // clear unread
                  setConversations((prev) => {
                    const m = new Map(prev);
                    const ex = m.get(c.dm.id);
                    if (ex) {
                      m.set(c.dm.id, { ...ex, unreadCount: 0 });
                    }
                    return m;
                  });
                }}
              >
                <div className="font-medium flex justify-between items-center">
                  <span>{formatUserAddress(c.userAddress)}</span>
                  {c.unreadCount && c.unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                {c.lastMessage && (
                  <div className="text-xs text-gray-400 truncate">
                    {renderMessageContent(c.lastMessage.content)}
                    {!c.lastAdminReplyAt ||
                    (c.lastMessage?.sentAtNs ?? 0) >
                      BigInt(c.lastAdminReplyAt * 1e6) ? (
                      <span className="ml-2 text-yellow-400">
                        (Needs reply)
                      </span>
                    ) : (
                      <span className="ml-2 text-green-400">(Replied)</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          {conversations.size === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations
            </div>
          )}
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="flex items-center gap-2 p-3 border-b border-gray-700 bg-gray-800">
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

          <div
            ref={messagesContainerRef}
            className="p-3 space-y-2 bg-gray-900"
            style={{ flexGrow: 1, overflowY: "auto", height: "100%" }}
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
                    className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${
                      mine ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
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
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t border-gray-700 flex gap-2 bg-gray-800">
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
              onClick={sendMessage}
              disabled={isSending}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
      {error && <div className="p-2 text-red-400">{error}</div>}
    </div>
  );
}

export default AdminInterface;
