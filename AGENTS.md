# Passport (Travel & Tour) — Permanent Engineering Rules

> **Core Principle:** Every extra layer must earn its existence. If direct code is clearer and equally maintainable, choose direct code. The goal is the simplest reliable architecture that another developer can understand and modify safely months later.

These workspace rules apply automatically to all future implementation tasks, reviews, and delegated agents working in `Travel-and-Tour`.

---

## 1. Strict Simplicity & Anti-Overengineering Rules

### 1.1 Simplicity First
- Prefer the simplest correct, maintainable solution.
- Do not introduce abstractions without a demonstrated need.
- Do not create files solely to make the folder tree look organized.
- Do not split components or hooks purely based on line count.
- Do not introduce design patterns, classes, factories, or dependency injection into simple React code without a clear payoff.
- Do not add dependencies when existing tools are sufficient.
- Avoid excessive layers of indirection and speculative future-proofing.

### 1.2 No Barrel Exports
- **Do not create `index.ts` or `index.tsx` files solely to re-export components, hooks, utilities, or types.**
- Always prefer **direct imports from the actual source file**.
- Remove existing unnecessary barrel files only after updating and verifying every consumer.
- Exceptions require an explicit technical justification and explicit user approval.

### 1.3 No Pass-Through Wrappers
- **Do not create components that simply forward props to another component without adding meaningful layout, behavior, composition, styling, accessibility, or an architectural boundary.**
- Example to avoid:
  ```tsx
  export const ItineraryModal = (props: Props) => {
    return <TourItinerary {...props} />;
  };
  ```
- Prefer one clearly named component imported directly.
- Before removing an existing wrapper, verify all consumers, exports, dynamic imports, and behavioral contracts.

### 1.4 No Abstraction Without Necessity
Every abstraction must solve a real, demonstrated problem. Do not create:
- Unnecessary custom hooks that only wrap trivial expressions.
- One-line utility wrappers.
- Redundant service layers that add no reuse, normalization, or testability value.
- Generic components used only once without a meaningful reason.
- Interfaces for trivial one-time values.
- Excessive nested folders holding single trivial files.
- Extra files added merely to make the architecture look sophisticated.

### 1.5 Prefer Direct, Readable Code
Optimize for developers who will maintain the project months later. Prefer:
- Explicit dependencies and direct imports.
- Clear names and cohesive components.
- Simple data flow and minimal indirection.
- Small, justified architectural boundaries.

Avoid making developers navigate multiple files to understand one simple behavior.

### 1.6 Mandatory Abstraction Review (Pre-Creation Gate)
Before creating any new component, hook, service, or utility, answer internally:
1. Is this new file necessary?
2. Why is it necessary and what specific problem does it solve?
3. Can existing straightforward code solve the problem in its current module?
4. Does this abstraction actually reduce complexity rather than merely relocating it?
5. Is the benefit worth the additional file, indirection, and dependency?
6. Does this introduce unnecessary coupling?
7. Would a developer understand this easily three months from now?
8. Is the solution proportionate to actual requirements, with all existing behaviors preserved?

If the answers do not establish a meaningful benefit, **do not create the abstraction**.

---

## 2. Feature Architecture, Cohesion & Naming

### 2.1 Feature-Based Architecture & Co-Location
Follow the approved directory layout:
- `app/`: Next.js routing, layouts, and API route handlers only.
- `features/`: Feature-specific components, hooks, services, validation, data, and types co-located with their owning domain (`auth`, `home`, `packages`, `sunny`).
- `components/`: Strictly genuinely reusable UI primitives (`components/ui/`) and shared layout (`components/layout/`).
- `lib/`: Shared cross-feature utilities (`lib/utils/`), HTTP client (`lib/http/`), query keys (`lib/query/`), i18n (`lib/i18n/`), and shared validation (`lib/validations/`).
- `lib/server/`: **Strictly server-only modules** (DB, auth sessions/tokens, env config, external payment/AI backends).

Do not move feature-specific utilities, data, or types into global directories without real cross-feature reuse. Do not create deeply nested folders for single trivial files.

### 2.2 Pragmatic SOLID, High Cohesion & Low Coupling
- **SRP:** Each module has one coherent responsibility.
- **OCP / LSP / ISP / DIP:** Apply only where actual change patterns, polymorphism, interface bloat, or testability justify them. Do not force classes, inheritance, or DI into simple React code.
- Keep closely related logic together; avoid scattering one feature across unrelated directories.
- Minimize cross-feature dependencies, prevent circular imports, keep dependencies explicit, and avoid deeply nested prop forwarding.

### 2.3 Naming & Discoverability
- Use names that directly describe responsibilities.
- Avoid generic names (`Helper`, `Manager`, `Common`, `Utils`, `Form`) for domain-specific modules.
- Avoid multiple differently named components performing the same job or unnecessary aliases and re-export layers.

---

## 3. React, TypeScript & State Management

### 3.1 React Best Practices
- Prefer clear functional components and straightforward composition.
- Use custom hooks to share meaningful stateful behavior, not to hide trivial expressions.
- Avoid unnecessary `useEffect` chains and derived state that can be computed directly during render.
- Do not use `useMemo` or `useCallback` without a demonstrated referential-stability or performance need.
- Avoid redundant state and unnecessary context providers.
- Preserve correct hook ordering (including LiveKit `<RoomContext.Provider>` boundaries), keep state as local as reasonably possible, and avoid premature optimization.

### 3.2 TypeScript Standards
- Use meaningful, precise types and keep `strict: true` clean.
- Avoid `any`; use `unknown` with narrowing when data is untrusted.
- Avoid unnecessary type assertions and duplicated domain contracts.
- Prefer inference when types are already clear, keep types near their owning features, and avoid complex generic abstractions unless solving a real problem.

### 3.3 State Management
- Use **TanStack React Query** for server state, reusing centralized query keys (`lib/query/queryKeys.ts`).
- Use React state for local UI state.
- Avoid duplicating server data into separate global stores or adding new state libraries without a clear need.
- Handle authentication cache eviction explicitly on logout and `401` invalidation (`clearUserScopedCache`).

---

## 4. API, Server Boundaries & Security

- Isolate server-only modules under `lib/server/` and guard every file with `import "server-only";`.
- Prevent `@/lib/server/*`, database clients (`@prisma/client`), password hashing (`bcrypt`), JWT helpers (`jsonwebtoken`), or private keys from entering client bundles.
- Never export client-consumed TypeScript types from `app/api/**/route.ts`.
- Validate untrusted input (e.g. Zod), enforce authentication and immutable `userId` ownership checks server-side, derive payment prices strictly from PostgreSQL, enforce DB-backed idempotency for concurrent payments, and verify webhooks with constant-time HMAC comparison.
- Preserve API contracts, keep error handling explicit, and never silently swallow errors or expose secrets.

---

## 5. Code Quality, Refactoring Safety & Testing

### 5.1 Code Quality
- Remove confirmed dead code only after verifying zero references.
- Avoid duplicated logic; prefer early returns where they improve clarity; keep functions focused.
- Comment non-obvious decisions, invariants, and security rules rather than explaining obvious code.

### 5.2 Refactoring Safety Workflow
Before modifying existing code:
1. Understand its actual runtime behavior.
2. Inspect its consumers, exports, dynamic imports, and dependencies.
3. Identify the concrete problem.
4. Choose the smallest maintainable solution (never replace an abstraction with a more complicated one).
5. Modify only necessary files.
6. Run relevant checks (`npx tsc --noEmit`, automated tests, ESLint, `npm run build`).
7. Review the actual Git diff.
8. Verify no unintended behavior, animation, RTL/LTR, responsive, or UI change.

### 5.3 Testing & Verification Standards
- Use proportional testing: unit-test meaningful business logic, utilities, authentication token lifecycle, payment security/idempotency/webhooks, and server boundaries.
- Avoid brittle tests coupled to internal implementation details; preserve existing passing tests.
- Run TypeScript, ESLint, and build validation as appropriate, and never report unexecuted tests as passing.

---

## 6. Production Safety & Cost-Efficient Delegation

### 6.1 Production Safety (Non-Negotiable)
- Preserve existing UI/UX, animations, responsive behavior, Arabic RTL, English LTR, routes, and API contracts.
- Never modify, migrate, seed, or run database integration tests against the live Vercel-connected Neon `DATABASE_URL` without explicit separate authorization.
- Never deploy, push to GitHub, reset Git history, overwrite pre-existing uncommitted user changes, or execute destructive operations without approval.

### 6.2 Cost-Efficient Multi-Model Delegation
- **Orchestrator (Neon):** Architecture decisions, security/DB/auth reviews, task decomposition, and final review of diffs and evidence.
- **Gemini 3.8 Flash (Default Executor):** Routine refactoring, file moves, import updates, mechanical cleanup, simple tests, and TypeScript/ESLint fixes.
- **Gemini 4 Hydrogen (Escalation):** Complex cross-module implementation only when Flash cannot reliably complete it.
- Always disclose the actual models/tools used; never pretend to have invoked an unavailable model.

### 6.3 Graphify MCP — Dependency-Aware Refactoring

- Use Graphify MCP before medium-risk or high-risk changes involving multiple modules.
- Prefer targeted `get_node`, `get_neighbors`, or `query_graph` calls.
- Limit query depth and token budget to avoid unnecessary usage.
- Verify the graph is up to date before relying on it.
- Cross-check critical dependencies against actual source code.
- Use Graphify to identify affected consumers and potential regression risks.
- Do not use Graphify for trivial styling, import corrections, or isolated bug fixes.
- Never treat graph analysis as a replacement for testing.
- Do not use the CLI fallback automatically if MCP fails; report the failure.
- Avoid redundant graph queries.
