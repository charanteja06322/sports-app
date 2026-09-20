import React, { useState } from "react";
import { IconHeart, IconMessageCircle, IconClock } from "./EzkoraIcons";
import { Link } from "react-router-dom";
import { Avatar, Button } from "./CommonUI";
import { useEzkoraStore, SPORTS } from "../../store/ezkoraStore";

function formatRelative(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hr ago";
    if (diffHours < 24) return `${diffHours} hrs ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Recently";
  }
}

export function PostCard({ post }) {
  const me = useEzkoraStore((s) => s.me);
  const toggleLike = useEzkoraStore((s) => s.toggleLikePost);
  const addComment = useEzkoraStore((s) => s.addComment);
  const players = useEzkoraStore((s) => s.players);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const sendChatMessage = useEzkoraStore((s) => s.sendChatMessage);
  const setActiveChatId = useEzkoraStore((s) => s.setActiveChatId);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharedStatus, setSharedStatus] = useState("");

  const friends = (players.length > 0 ? players : allAthletes).filter(
    (p) => p && String(p.id) !== String(me?.id) && p.publicId !== me?.publicId
  );

  const sportConfig =
    SPORTS.find((s) => s.name === post.sport) || SPORTS[0];

  const isLikedByMe =
    Boolean(post.likedBy?.includes(String(me?.id))) || Boolean(post.likedByMe);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText("");
    setCommentsOpen(true);
  };

  const handleShareToFriend = (friend) => {
    sendChatMessage({
      toPlayerId: friend.id,
      text: `Check out this ${post.sport} highlight by ${post.author?.displayName || "an athlete"}: "${post.caption?.slice(0, 70) || ""}"`,
      sharedPost: {
        id: post.id,
        author: post.author,
        caption: post.caption,
        imagePath: post.imagePath,
        sport: post.sport,
      },
    });
    setSharedStatus(`✓ Sent to ${friend.displayName} in Chat!`);
    setTimeout(() => setSharedStatus(""), 3000);
  };

  const handleCopyPostLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + "/#/");
      setSharedStatus("✓ Post link copied!");
      setTimeout(() => setSharedStatus(""), 2500);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-[#DDD6C8] bg-white shadow-xs transition-all hover:shadow-md">
      {/* Post Author Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        <Avatar player={post.author} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-[#253638]">
            {post.author?.displayName || post.author?.publicId || "Athlete"}
          </p>
          <p className="mono-font mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[#71807d]">
            {post.author?.publicId || "PL-000000"} · {formatRelative(post.createdAt)}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold shadow-xs"
          style={{
            color: sportConfig.deep,
            backgroundColor: sportConfig.wash,
          }}
        >
          {post.sport}
        </span>
      </div>

      {/* Post Photo */}
      {post.imagePath && (
        <div className="overflow-hidden bg-[#FAF7F2] max-h-[420px] flex items-center justify-center border-y border-[#DDD6C8]">
          <img
            src={post.imagePath}
            alt="Community moment"
            className="w-full max-h-[420px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Caption */}
      {post.caption && (
        <p className="px-5 pt-4 text-[14px] leading-relaxed text-[#253638]">
          {post.caption}
        </p>
      )}

      {/* Actions (Like & Comment buttons) */}
      <div className="flex items-center gap-6 px-5 py-4">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={`action-ring inline-flex items-center gap-2 text-[13px] font-bold transition-transform active:scale-95 ${
            isLikedByMe
              ? "text-[#bd5549]"
              : "text-[#71807d] hover:text-[#253638]"
          }`}
        >
          <IconHeart
            size={18}
            className={isLikedByMe ? "fill-current text-[#bd5549]" : ""}
          />
          <span>{post.likeCount || 0}</span>
        </button>

        <button
          type="button"
          onClick={() => setCommentsOpen((open) => !open)}
          className="action-ring inline-flex items-center gap-2 text-[13px] font-bold text-[#71807d] hover:text-[#253638]"
        >
          <IconMessageCircle size={18} />
          <span>{post.comments?.length || post.commentCount || 0}</span>
        </button>

        <button
          type="button"
          onClick={() => setShareModalOpen(true)}
          className="action-ring inline-flex items-center gap-1.5 text-[13px] font-bold text-[#71807d] hover:text-[#253638] ml-auto"
          title="Share post to friends in chat"
        >
          <span>✈️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Share to Friends Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="ezkora-fade w-full max-w-sm rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DDD6C8] pb-3">
              <div>
                <h3 className="display-font text-base font-bold text-[#18181b]">
                  Share to Friends
                </h3>
                <p className="mono-font text-[10px] text-[#71807d]">
                  Send this {post.sport} post directly in chat
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="grid size-7 place-items-center rounded-full text-[#71807d] hover:bg-[#EAE4D7] hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            {sharedStatus && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs font-bold text-emerald-800">
                {sharedStatus}
              </div>
            )}

            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              {friends.length === 0 ? (
                <p className="text-center text-xs text-[#71807d] py-4">
                  No other athletes yet. Use the copy link button below!
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar player={friend} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#18181b]">
                          {friend.displayName}
                        </p>
                        <p className="mono-font text-[10px] text-[#71807d]">
                          {friend.publicId}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleShareToFriend(friend)}
                      className="text-[11px] py-1 px-3"
                    >
                      Send
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#DDD6C8] pt-3 gap-2">
              <Button
                variant="quiet"
                onClick={handleCopyPostLink}
                className="text-xs flex-1"
              >
                📋 Copy Link
              </Button>
              <Link
                to="/players"
                onClick={() => setShareModalOpen(false)}
                className="text-xs font-bold text-[#277863] hover:underline"
              >
                Go to Chat →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Comments Drawer */}
      {commentsOpen && (
        <div className="border-t border-[#DDD6C8] bg-[#FAF7F2]/60 px-5 py-4">
          <div className="space-y-2.5">
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-xs text-[#71807d]">No comments yet. Start the conversation!</p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start">
                  <Avatar player={c.author} size="sm" />
                  <div className="rounded-xl border border-[#DDD6C8] bg-white px-3 py-2 text-xs leading-relaxed shadow-xs flex-1">
                    <b className="text-[#253638] mr-1.5">
                      {c.author.displayName || c.author.publicId}
                    </b>
                    <span className="text-[#253638]">{c.body}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mt-3.5 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a thoughtful reply..."
              className="min-w-0 flex-1 rounded-xl border border-[#DDD6C8] bg-white px-3 py-2 text-xs outline-none focus:border-[#277863]"
            />
            <Button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 min-h-8 text-xs"
            >
              Reply
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
