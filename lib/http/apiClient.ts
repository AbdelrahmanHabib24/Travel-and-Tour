export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (typeof init?.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    credentials: init?.credentials ?? "include",
    headers,
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const record =
      data && typeof data === "object"
        ? (data as { error?: unknown; message?: unknown })
        : null;
    const message =
      (typeof record?.error === "string" && record.error) ||
      (typeof record?.message === "string" && record.message) ||
      `Request failed (${res.status})`;

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}