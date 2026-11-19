import { apiRequest } from "@/lib/http/apiClient";

export interface InitiatePaymentPayload {
  idempotencyKey?: string;
}

export interface InitiatePaymentResponse {
  success: boolean;
  sessionId: string;
  paymentToken: string;
  amount: number;
  reused?: boolean;
}

export async function initiatePackagePayment(
  packageId: number | string,
  payload?: InitiatePaymentPayload
): Promise<InitiatePaymentResponse> {
  const headers: Record<string, string> = {};
  if (payload?.idempotencyKey) {
    headers["Idempotency-Key"] = payload.idempotencyKey;
  }

  return apiRequest<InitiatePaymentResponse>(
    `/api/packages/${encodeURIComponent(String(packageId))}/payment`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(
        payload?.idempotencyKey
          ? { idempotencyKey: payload.idempotencyKey }
          : {}
      ),
    }
  );
}

export const paymentService = {
  initiatePackagePayment,
};