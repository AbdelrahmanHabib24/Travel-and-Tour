import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { clearUserScopedCache, useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/http/apiClient";
import { paymentService } from "../services/payment.service";
import type { PackageRecord } from "../types";

export function usePackageBooking(packageDetails?: PackageRecord | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const t = useTranslations("package-details");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReserveClick = useCallback(async () => {
    if (!user.isLoggedIn) {
      toast.warning(t("booking.loginRequired"));
      router.push("/Login");
      return;
    }

    if (!packageDetails) return;

    setIsProcessing(true);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `pay-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const { sessionId } = await paymentService.initiatePackagePayment(
        packageDetails.id,
        { idempotencyKey }
      );

      router.push(`/payment/${sessionId}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof ApiError && err.status === 401) {
        await clearUserScopedCache(queryClient);
        toast.warning(t("booking.loginRequired"));
        router.push("/Login");
      } else {
        toast.error(t("booking.paymentFailed"));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [packageDetails, user, queryClient, router, t]);

  return {
    isProcessing,
    handleReserveClick,
    user,
  };
}

