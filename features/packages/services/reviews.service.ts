import { apiRequest } from "@/lib/http/apiClient";
import type { CommentItem } from "../types";

export async function getPackageComments(
  packageId: string
): Promise<CommentItem[]> {
  const data = await apiRequest<unknown>(
    `/api/packages/${encodeURIComponent(packageId)}/comments`,
    { cache: "no-store" }
  );
  return Array.isArray(data) ? (data as CommentItem[]) : [];
}

export async function addPackageComment(
  packageId: string,
  text: string
): Promise<CommentItem> {
  return apiRequest<CommentItem>(
    `/api/packages/${encodeURIComponent(packageId)}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ text }),
    }
  );
}

export async function editPackageComment(
  packageId: string,
  commentId: number,
  text: string
): Promise<CommentItem> {
  return apiRequest<CommentItem>(
    `/api/packages/${encodeURIComponent(packageId)}/comments`,
    {
      method: "PATCH",
      body: JSON.stringify({ commentId, text }),
    }
  );
}

export async function deletePackageComment(
  packageId: string,
  commentId: number
): Promise<{ message?: string }> {
  return apiRequest<{ message?: string }>(
    `/api/packages/${encodeURIComponent(packageId)}/comments?commentId=${encodeURIComponent(String(commentId))}`,
    {
      method: "DELETE",
      body: JSON.stringify({ commentId }),
    }
  );
}

export const reviewsService = {
  getPackageComments,
  addPackageComment,
  editPackageComment,
  deletePackageComment,
};