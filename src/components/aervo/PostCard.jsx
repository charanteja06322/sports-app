import React, { useState } from "react";
import { IconHeart, IconMessageCircle, IconClock } from "./AervoIcons";
import { Avatar, Button } from "./CommonUI";
import { useAervoStore, SPORTS } from "../../store/aervoStore";

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
  const me = useAervoStore((s) => s.me);
  const toggleLike = useAervoStore((s) => s.toggleLikePost);
  const addComment = useAervoStore((s) => s.addComment);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

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
      </div>

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
