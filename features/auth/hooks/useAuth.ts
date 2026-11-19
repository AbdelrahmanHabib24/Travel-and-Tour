"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { authService } from "../services/auth.service";
import type { AuthState, AuthUser } from "../types";

export type AuthCacheClient = Pick<
  QueryClient,
  "cancelQueries" | "setQueryData" | "removeQueries"
>;

export async function clearUserScopedCache(
  queryClient: AuthCacheClient
): Promise<void> {
  await queryClient.cancelQueries({ queryKey: queryKeys.auth.all });
  queryClient.setQueryData(queryKeys.auth.user, null);
  queryClient.removeQueries({ queryKey: queryKeys.payment.all });
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AuthUser | null>({
    queryKey: queryKeys.auth.user,
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const user: AuthState = data
    ? { ...data, isLoggedIn: true }
    : { isLoggedIn: false };

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: async () => {
      await clearUserScopedCache(queryClient);
    },
  });

  return {
    user,
    isLoggedIn: user.isLoggedIn,
    isLoading,
    logout: () => logoutMutation.mutateAsync(),
    isLoggingOut: logoutMutation.isPending,
  };
}