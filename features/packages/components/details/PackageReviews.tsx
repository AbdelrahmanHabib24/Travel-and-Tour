import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LuCheck, LuX, LuPencil, LuTrash2 } from "react-icons/lu";
import type { CommentItem } from "../../types";

export interface PackageReviewsProps {
  comments: CommentItem[];
  isLoggedIn: boolean;
  currentUsername?: string;
  newComment: string;
  onNewCommentChange: (val: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  isAdding: boolean;
  editingCommentId: number | null;
  editingText: string;
  onEditingTextChange: (val: string) => void;
  onStartEdit: (id: number, text: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  isSavingEdit: boolean;
  onDeleteComment: (id: number) => void;
  formatDate: (isoString?: string) => string;
}

export const PackageReviews: React.FC<PackageReviewsProps> = ({
  comments,
  isLoggedIn,
  currentUsername,
  newComment,
  onNewCommentChange,
  onSubmitComment,
  isAdding,
  editingCommentId,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  isSavingEdit,
  onDeleteComment,
  formatDate,
}) => {
  const t = useTranslations("package-details");

  return (
    <motion.div
      key="reviews"
      id="panel-reviews"
      role="tabpanel"
      aria-labelledby="tab-reviews"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Reviews Header with Real Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>{t("reviews.title")}</span>
          <span className="text-sm font-semibold text-gray-500">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Add Review / Comment Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs">
        {isLoggedIn ? (
          <form onSubmit={onSubmitComment} className="space-y-3">
            <textarea
              name="package-review"
              aria-label={t("reviews.addReview")}
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              placeholder={t("reviews.placeholder")}
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAdding || !newComment.trim()}
                className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAdding ? t("reviews.submitting") : t("reviews.submit")}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3 py-2 text-sm text-gray-600">
            <span>{t("reviews.loginToReview")}</span>
            <Link
              href="/Login"
              className="px-4 py-2 rounded-full border border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition"
            >
              {t("comments.loginRequired")}
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List or Honest Empty State */}
      {comments.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70">
          <p className="text-neutral-500 text-sm sm:text-base font-medium">
            {t("reviews.noReviews")}
          </p>
        </div>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {comments.map((c) => {
            const isOwner = isLoggedIn && c.userName === currentUsername;
            const isEditing = editingCommentId === c.id;

            return (
              <li
                key={c.id}
                className="p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {c.avatarUrl ? (
                      <Image
                        src={c.avatarUrl}
                        alt={c.userName}
                        width={36}
                        height={36}
                        className="rounded-full shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        {c.userName
                          ? c.userName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {c.userName}
                      </p>
                      {c.createdAt && (
                        <p className="text-xs text-gray-400">
                          {formatDate(c.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ownership Actions */}
                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onStartEdit(c.id, c.text)}
                        aria-label={t("comments.editBtn")}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                      >
                        <LuPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        aria-label={t("comments.deleteBtn")}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Content / Inline Edit */}
                {isEditing ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={editingText}
                      onChange={(e) => onEditingTextChange(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition flex items-center gap-1 cursor-pointer"
                      >
                        <LuX className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSaveEdit(c.id)}
                        disabled={isSavingEdit || !editingText.trim()}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <LuCheck className="w-3 h-3" />
                        <span>
                          {isSavingEdit
                            ? t("reviews.submitting")
                            : t("comments.editBtn")}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                    {c.text}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
};

export default PackageReviews;

