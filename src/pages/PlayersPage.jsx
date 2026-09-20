import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useEzkoraStore } from "../store/ezkoraStore";
import { Avatar, Button } from "../components/ezkora/CommonUI";
import {
  IconSearch,
  IconUsers,
  IconCheck,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
  IconMessageCircle,
  IconTrophy,
  SportIcon,
} from "../components/ezkora/EzkoraIcons";

export default function PlayersPage() {
  const me = useEzkoraStore((s) => s.me);
  const players = useEzkoraStore((s) => s.players);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const games = useEzkoraStore((s) => s.games);
  const chats = useEzkoraStore((s) => s.chats) || {};
  const activeChatId = useEzkoraStore((s) => s.activeChatId);
  const setActiveChatId = useEzkoraStore((s) => s.setActiveChatId);
  const sendChatMessage = useEzkoraStore((s) => s.sendChatMessage);

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Combine registered athletes
  const athleteList = (players.length > 0 ? players : allAthletes).filter(
    (p) => p && String(p.id) !== String(me?.id) && p.publicId !== me?.publicId
  );

  const filteredAthletes = athleteList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.displayName?.toLowerCase().includes(q) ||
      p.publicId?.toLowerCase().includes(q) ||
      p.primarySport?.toLowerCase().includes(q)
    );
  });

  // Selected athlete for active chat
  const activeAthlete = athleteList.find((p) => String(p.id) === String(activeChatId));

  // Conversation key for current chat
  const currentConvKey = activeAthlete && me ? [String(me.id), String(activeAthlete.id)].sort().join("_") : null;
  const currentMessages = (currentConvKey && chats[currentConvKey]) || [];

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages.length]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeAthlete) return;
    sendChatMessage({
      toPlayerId: activeAthlete.id,
      text: inputText.trim(),
    });
    setInputText("");
  };

  const handleSendEmoji = (emoji) => {
    if (!activeAthlete) return;
    sendChatMessage({
      toPlayerId: activeAthlete.id,
      text: emoji,
    });
  };

  const handleSendMatchInvite = (match) => {
    if (!activeAthlete || !match) return;
    sendChatMessage({
      toPlayerId: activeAthlete.id,
      text: `Let's play ${match.sport}! I've invited you to "${match.title}".`,
      matchInvite: {
        id: match.id,
        title: match.title,
        sport: match.sport,
        scheduledAt: match.scheduledAt,
      },
    });
  };

  // Open matches hosted by me to invite
  const myOpenMatches = games.filter(
    (g) => g.status !== "finished" && (g.host?.id === me?.id || g.host?.publicId === me?.publicId)
  );

  // Quick helper for last message in conversation
  const getLastMessage = (athleteId) => {
    if (!me) return null;
    const key = [String(me.id), String(athleteId)].sort().join("_");
    const msgs = chats[key];
    if (msgs && msgs.length > 0) {
      return msgs[msgs.length - 1];
    }
    return null;
  };

  return (
    <main className="mx-auto max-w-[1240px] px-3 sm:px-6 lg:px-8 py-6">
      {/* Instagram-style Direct Messages Frame */}
      <div className="overflow-hidden rounded-3xl border border-[#DDD6C8] bg-white shadow-lg grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)] h-[calc(100vh-140px)] min-h-[580px]">
        {/* LEFT COLUMN: Athletes & Conversations List */}
        <div
          className={`flex flex-col border-r border-[#DDD6C8] bg-[#FAF7F2]/60 ${
            activeAthlete ? "hidden md:flex" : "flex"
          }`}
        >
          {/* DM Header */}
          <div className="p-4 border-b border-[#DDD6C8] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar player={me} size="sm" />
              <div>
                <span className="display-font font-bold text-sm text-[#18181b] block">
                  {me?.displayName || "My Direct Messages"}
                </span>
                <span className="mono-font text-[10px] text-[#71807d]">
                  {me?.publicId} · Online
                </span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-500/20">
              Active Chat
            </span>
          </div>

          {/* Search Athlete / ID */}
          <div className="p-3 border-b border-[#DDD6C8] bg-white">
            <div className="flex items-center gap-2 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-2 text-xs">
              <IconSearch size={14} className="text-[#71807d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete or Player ID..."
                className="w-full bg-transparent outline-none text-[#253638] placeholder:text-[#9BA6A3]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[#71807d] hover:text-black font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Conversations / Athletes list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#DDD6C8]/50">
            {filteredAthletes.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#71807d]">
                <p className="font-bold text-[#253638]">No athletes found</p>
                <p className="mt-1">Try another name or Player ID.</p>
              </div>
            ) : (
              filteredAthletes.map((athlete) => {
                const isSelected = String(athlete.id) === String(activeChatId);
                const lastMsg = getLastMessage(athlete.id);
                const isUnread = lastMsg && String(lastMsg.fromId) !== String(me?.id);

                return (
                  <button
                    key={athlete.id}
                    type="button"
                    onClick={() => setActiveChatId(athlete.id)}
                    className={`w-full flex items-center gap-3.5 p-3.5 text-left transition-all hover:bg-white ${
                      isSelected ? "bg-white border-l-4 border-l-[#18181b] shadow-xs" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar player={athlete} size="md" />
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`truncate text-[13px] text-[#18181b] ${
                            isSelected || isUnread ? "font-bold" : "font-semibold"
                          }`}
                        >
                          {athlete.displayName}
                        </p>
                        {lastMsg && (
                          <span className="mono-font text-[9px] text-[#71807d]">
                            {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                        <p className="truncate text-xs text-[#71807d]">
                          {lastMsg ? (
                            <span>
                              {String(lastMsg.fromId) === String(me?.id) ? "You: " : ""}
                              {lastMsg.text}
                            </span>
                          ) : (
                            <span className="italic text-[#9BA6A3]">
                              {athlete.publicId} · Tap to chat
                            </span>
                          )}
                        </p>
                        {athlete.primarySport && (
                          <span className="ml-2 shrink-0 rounded-md bg-[#FAF7F2] border border-[#DDD6C8] px-1.5 py-0.5 text-[9px] font-bold text-[#71807d]">
                            {athlete.primarySport}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Conversation Window */}
        <div
          className={`flex flex-col bg-white ${
            !activeAthlete ? "hidden md:flex" : "flex"
          }`}
        >
          {!activeAthlete ? (
            /* Empty state when no chat is open */
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]/40">
              <div className="grid size-16 place-items-center rounded-3xl border border-[#DDD6C8] bg-white text-[#18181b] shadow-md mb-4">
                <IconMessageCircle size={32} />
              </div>
              <h2 className="display-font text-2xl font-bold tracking-tight text-[#18181b]">
                Your Messages
              </h2>
              <p className="mt-1 text-xs text-[#71807d] max-w-sm">
                Chat directly with verified players, send match invites, coordinate game times, and share highlights.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md">
                {athleteList.slice(0, 4).map((ath) => (
                  <button
                    key={ath.id}
                    type="button"
                    onClick={() => setActiveChatId(ath.id)}
                    className="flex items-center gap-2 rounded-2xl border border-[#DDD6C8] bg-white px-3 py-2 text-xs font-bold text-[#253638] shadow-xs hover:border-[#18181b] transition-all"
                  >
                    <Avatar player={ath} size="xs" />
                    <span>Chat with {ath.displayName}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Conversation Room */
            <div className="flex flex-col h-full">
              {/* Chat Window Header */}
              <div className="flex items-center justify-between border-b border-[#DDD6C8] p-4 bg-white shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Mobile Back button */}
                  <button
                    type="button"
                    onClick={() => setActiveChatId(null)}
                    className="grid size-8 place-items-center rounded-xl border border-[#DDD6C8] text-[#71807d] hover:bg-[#FAF7F2] md:hidden"
                  >
                    <IconArrowLeft size={16} />
                  </button>

                  <div className="relative">
                    <Avatar player={activeAthlete} size="md" />
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#18181b]">
                        {activeAthlete.displayName}
                      </p>
                      <span className="rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                        Verified
                      </span>
                    </div>
                    <p className="mono-font text-[10px] text-[#71807d]">
                      {activeAthlete.publicId} · {activeAthlete.primarySport || "Multi-sport"}
                    </p>
                  </div>
                </div>

                {/* Header Action: Quick Match Invite */}
                {myOpenMatches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSendMatchInvite(myOpenMatches[0])}
                    className="flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#18181b] hover:bg-white transition-all shadow-xs"
                  >
                    <span>🏆 Invite to {myOpenMatches[0].sport}</span>
                  </button>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FAF7F2]/30">
                {/* Athlete Introduction Card */}
                <div className="text-center py-6 border-b border-[#DDD6C8]/60 mb-4">
                  <div className="mx-auto inline-block">
                    <Avatar player={activeAthlete} size="xl" />
                  </div>
                  <h3 className="display-font mt-2 text-lg font-bold text-[#18181b]">
                    {activeAthlete.displayName}
                  </h3 >
                  <p className="mono-font text-[11px] text-[#71807d]">
                    EZKORA ID: {activeAthlete.publicId}
                  </p>
                  <p className="mt-1 text-xs text-[#71807d] max-w-xs mx-auto">
                    {activeAthlete.bio || "Active sports competitor"}
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-[#277863] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Connected in {activeAthlete.primarySport || "EZKORA"}
                  </span>
                </div>

                {/* Messages List */}
                {currentMessages.length === 0 ? (
                  <p className="text-center text-xs text-[#71807d] italic py-8">
                    Start a conversation! Say hello or invite {activeAthlete.displayName.split(" ")[0]} for a match.
                  </p>
                ) : (
                  currentMessages.map((msg) => {
                    const isMe = String(msg.fromId) === String(me?.id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed ${
                            isMe
                              ? "bg-[#18181b] text-white rounded-tr-xs"
                              : "bg-white border border-[#DDD6C8] text-[#253638] rounded-tl-xs"
                          }`}
                        >
                          {/* Match Invite Bubble */}
                          {msg.matchInvite && (
                            <div className="mb-2 rounded-xl bg-black/10 p-2.5 border border-white/20">
                              <div className="flex items-center gap-2 text-[11px] font-bold mb-1">
                                <IconTrophy size={14} />
                                <span>Match Invitation</span>
                              </div>
                              <p className="font-bold">{msg.matchInvite.title}</p>
                              <Link
                                to={`/matches/${msg.matchInvite.id}`}
                                className="mt-2 inline-block font-bold text-[10px] underline"
                              >
                                View Match Fixture & Roster →
                              </Link>
                            </div>
                          )}

                          {/* Shared Post Bubble */}
                          {msg.sharedPost && (
                            <div className="mb-2 overflow-hidden rounded-xl border border-white/20 bg-black/10">
                              {msg.sharedPost.imagePath && (
                                <img
                                  src={msg.sharedPost.imagePath}
                                  alt="Shared post"
                                  className="w-full max-h-40 object-cover"
                                />
                              )}
                              <div className="p-2.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80 mb-1">
                                  <span>📷 Shared {msg.sharedPost.sport} Post</span>
                                </div>
                                <p className="font-semibold text-[11px] line-clamp-2">
                                  {msg.sharedPost.caption}
                                </p>
                              </div>
                            </div>
                          )}

                          <p>{msg.text}</p>
                        </div>

                        <span className="mono-font text-[9px] text-[#71807d] mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <div className="border-t border-[#DDD6C8] p-3 bg-white">
                {/* Quick Emoji shortcuts */}
                <div className="flex items-center gap-1.5 pb-2 text-sm">
                  {["🏸", "⚽", "🏀", "🏆", "👏", "🔥", "🤝"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSendEmoji(emoji)}
                      className="rounded-lg p-1 hover:bg-[#FAF7F2] transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeAthlete.displayName}...`}
                    className="flex-1 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-2.5 text-xs text-[#253638] placeholder:text-[#9BA6A3] focus:bg-white focus:outline-none focus:border-[#18181b]"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="grid size-9 place-items-center rounded-2xl bg-[#18181b] text-white shadow-xs hover:bg-black transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                  >
                    <IconArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
