import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { clearUserScopedCache, useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/http/apiClient";
import { queryKeys } from "@/lib/query/queryKeys";
import { reviewsService } from "../services/reviews.service";
import type { CommentItem } from "../types";

export function usePackageReviews(id: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("package-details");
  const isRTL = locale === "ar";

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  /* -------------------- Fetch Comments -------------------- */
  const { data: comments = [] } = useQuery<CommentItem[]>({
    queryKey: queryKeys.packages.comments(id),
    queryFn: () => reviewsService.getPackageComments(id),
    enabled: !!id,
  });

  /* -------------------- Comment Mutations -------------------- */
  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user.isLoggedIn) {
        throw new Error("Unauthorized");
      }
      return reviewsService.addPackageComment(id, text);
    },
    onSuccess: (newCommentData: CommentItem) => {
      queryClient.setQueryData<CommentItem[]>(
        queryKeys.packages.comments(id),
        (old = []) => [newCommentData, ...old]
      );
      setNewComment("");
      toast.success(t("comments.addedSuccess"));
    },
    onError: (err: unknown) => {
      if (
        (err instanceof Error && err.message === "Unauthorized") ||
        (err instanceof ApiError && err.status === 401)
      ) {
        void clearUserScopedCache(queryClient);
        toast.error(t("comments.loginRequired"));
      } else {
        toast.error(t("comments.addFailed"));
      }
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      text,
    }: {
      commentId: number;
      text: string;
    }) => reviewsService.editPackageComment(id, commentId, text),
    onSuccess: (updated: CommentItem) => {
      queryClient.setQueryData<CommentItem[]>(
        queryKeys.packages.comments(id),
        (old = []) => old.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditingCommentId(null);
      setEditingText("");
      toast.success(t("comments.updatedSuccess"));
    },
    onError: () => {
      toast.error(t("comments.editFailed"));
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      reviewsService.deletePackageComment(id, commentId),
    onSuccess: (_, commentId: number) => {
      queryClient.setQueryData<CommentItem[]>(
        queryKeys.packages.comments(id),
        (old = []) => old.filter((c) => c.id !== commentId)
      );
      toast.success(t("comments.deletedSuccess"));
    },
    onError: () => {
      toast.error(t("comments.deleteFailed"));
    },
  });

  /* -------------------- Handlers -------------------- */
  const handleCommentSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newComment.trim()) {
        addCommentMutation.mutate(newComment.trim());
      }
    },
    [newComment, addCommentMutation]
  );

  const startEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const saveEditComment = (commentId: number) => {
    if (editingText.trim()) {
      editCommentMutation.mutate({
        commentId,
        text: editingText.trim(),
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm(t("comments.deleteConfirm"))) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return {
    comments,
    user,
    newComment,
    setNewComment,
    editingCommentId,
    editingText,
    setEditingText,
    handleCommentSubmit,
    startEditComment,
    cancelEditComment,
    saveEditComment,
    handleDeleteComment,
    formatDate,
    isAdding: addCommentMutation.isPending,
    isEditing: editCommentMutation.isPending,
  };
}

