# Initial Architecture Requirements

## Repository shape

The project should evolve toward a simple two-application structure:

```text
frontend/
backend/
.requirements/
```

Additional shared packages can be introduced later if real duplication appears. Do not create a complicated monorepo architecture prematurely.

## Frontend responsibilities

The frontend owns:

- conversation presentation;
- message composition;
- rendering remote live drafts;
- rendering committed messages;
- connection-state feedback;
- local optimistic UI state;
- reconnect behavior from the user's perspective.

The frontend must not own authoritative conversation membership or trust client-supplied identity/authorization decisions.

## Backend responsibilities

The backend owns:

- real-time client connections;
- conversation/room membership;
- routing live draft updates;
- routing committed messages;
- validating event payloads;
- connection/disconnection lifecycle;
- authoritative authorization rules when authentication is later introduced.

For the first proof of concept, persistence is optional. Draft state should be treated as ephemeral.

## Technology direction

Use TypeScript for both frontend and backend.

Preferred initial technologies:

- Frontend: React + Vite + TypeScript
- Backend: Node.js + TypeScript
- Real-time transport: Socket.IO initially, unless implementation work identifies a strong reason to use raw WebSockets
- Package manager: pnpm
- Tests: Vitest

Socket.IO is preferred for the first implementation because room membership, reconnect behavior, event semantics, and browser/server support are useful for quickly validating the interaction. The application protocol should still be designed so it is not conceptually dependent on Socket.IO-specific naming.

## Event-driven boundary

Frontend and backend should communicate through explicit events rather than sharing server implementation details.

Likely initial events include:

- `conversation:join`
- `conversation:leave`
- `draft:update`
- `draft:clear`
- `message:commit`
- `message:committed`
- `participant:joined`
- `participant:left`

Names may change during implementation, but event responsibilities should remain clear.
