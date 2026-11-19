import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}

function getUsdToEgpRate(): number {
  const raw = process.env.USD_TO_EGP_RATE?.trim();
  if (!raw) return 48;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Invalid USD_TO_EGP_RATE environment variable");
  }
  return parsed;
}

export function getPaymobConfig(): {
  apiKey: string;
  integrationId: number;
  hmacSecret: string | null;
  usdToEgpRate: number;
} {
  const apiKey = requireEnv("PAYMOB_API_KEY");
  const integrationIdRaw = requireEnv("PAYMOB_CASH_INTEGRATION_ID");
  const integrationId = Number(integrationIdRaw);
  if (!Number.isInteger(integrationId) || integrationId <= 0) {
    throw new Error("Invalid PAYMOB_CASH_INTEGRATION_ID environment variable");
  }

  return {
    apiKey,
    integrationId,
    hmacSecret: process.env.PAYMOB_HMAC_SECRET?.trim() || null,
    usdToEgpRate: getUsdToEgpRate(),
  };
}

export function getPaymobHmacSecret(): string | null {
  return process.env.PAYMOB_HMAC_SECRET?.trim() || null;
}
