export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: ["auth", "user"] as const,
  },
  packages: {
    all: ["packages"] as const,
    list: (filters?: { city?: string; maxPrice?: number }) =>
      filters
        ? (["packages", filters] as const)
        : (["packages"] as const),
    detail: (id: string | number) => ["package", String(id)] as const,
    comments: (id: string | number) => ["comments", String(id)] as const,
  },
  payment: {
    all: ["payment"] as const,
    session: (sessionId: string) => ["payment", "session", sessionId] as const,
  },
};