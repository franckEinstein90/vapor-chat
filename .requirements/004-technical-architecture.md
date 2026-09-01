# 004 — Technical Architecture

## Purpose

This document defines the proposed technical stack, component boundaries, runtime responsibilities, and communication model for Vapor Chat as it is rebuilt around live, character-by-character conversational typing.

The primary product behavior is that participants in a conversation can see another participant's draft evolve while it is being typed, rather than only seeing a generic "typing..." indicator and waiting for a completed message.

This document is architectural guidance and a technical requirement. It does not require full implementation yet.

## Architectural goals

The architecture should optimize for:

- very low latency for live draft updates
- clear separation between transient draft state and committed chat messages
- a simple TypeScript-first development model
- explicit real-time event contracts
- straightforward local development
- the ability to add persistence, authentication, horizontal scaling, moderation, encryption, and richer integrations later without rewriting the core live-typing model

The first implementation should remain intentionally small. A single backend process is sufficient initially.

## Proposed repository structure

```text
vapor-chat/
  frontend/
    src/
      components/
      features/
        chat/
        live-draft/
      hooks/
      services/
      state/
      types/

  backend/
    src/
      server/
      realtime/
      chat/
      rooms/
      users/
      protocol/

  shared/
    src/
      protocol/
      types/

  .requirements/
```

`shared/` is recommended once implementation begins so that frontend and backend can compile against the same event names and payload types. It may be introduced immediately or when the first protocol code is written.

## Frontend

### Stack

The frontend should use:

- React
- TypeScript
- Vite
- a lightweight styling system such as Tailwind CSS
- Socket.IO Client for real-time communication

A component library such as shadcn/ui may be introduced for common application chrome, dialogs, menus, buttons, and settings, but the chat experience itself should remain custom rather than being constrained by a generic chat component.

### Responsibilities

The frontend owns presentation and immediate interaction state.

It should:

- render conversations and committed messages
- maintain the local user's current draft
- display remote users' live drafts as they evolve
- distinguish visually between an in-progress live draft and a committed message
- send live draft updates to the backend
- receive live draft updates from other participants
- commit a message explicitly when the user sends it
- clear or finalize the displayed draft when a corresponding committed message arrives
- reconnect gracefully after temporary network interruptions

The frontend must not treat live draft updates as persisted messages.

### Local draft model

The user's local editor remains authoritative for what that user is currently typing.

Rather than transmitting only individual key codes, the frontend should generally transmit the current draft state or a versioned draft update. This supports:

- ordinary typing
- backspace/delete
- selection replacement
- paste
- cut
- mobile input methods
- autocomplete
- composition/IME input
- programmatic edits

This is more robust than assuming all edits can be represented as "append one character."

The UI may throttle or debounce extremely rapid updates slightly if necessary, but the target experience should still feel effectively character-by-character and synchronous to another participant.

## Backend

### Stack

The backend should use:

- Node.js
- TypeScript
- a lightweight HTTP server, preferably Fastify or Express
- Socket.IO for the real-time transport layer

Fastify is preferred for a new implementation because it provides a small, structured server foundation with strong TypeScript support. The existing Express code does not need to dictate the future architecture.

### Responsibilities

The backend owns connection coordination, room membership, event validation, routing, and eventual persistence of committed messages.

It should:

- accept WebSocket/Socket.IO connections
- associate each connection with a participant identity once authentication exists
- maintain conversation/room membership
- receive live draft updates
- validate their shape and size
- broadcast them only to appropriate participants
- receive committed message events
- eventually persist committed messages
- broadcast committed messages authoritatively
- clean up transient draft state when users disconnect or stop typing

The backend should not persist every keystroke as an ordinary chat message.

## Real-time transport

### Socket.IO

Socket.IO is the preferred initial real-time transport because the system needs frequent bidirectional updates, room semantics, reconnection behavior, acknowledgements, and a straightforward Node/browser integration.

The architecture should not depend unnecessarily on Socket.IO-specific types outside the transport layer. Domain event names and payloads should live in shared protocol definitions so the transport could later be changed if necessary.

### Connection model

A browser establishes a persistent Socket.IO connection to the backend.

A participant then joins one or more logical conversation rooms.

```text
Browser A
   |\
   | live:draft
   v
Realtime server -----> Browser B
   |
   | message:commit
   v
Message service / persistence
```

The server is responsible for ensuring that an event intended for conversation `X` is only broadcast to members authorized to participate in conversation `X`.

## Core event model

Exact names may evolve, but the protocol should clearly separate ephemeral draft events from durable message events.

Recommended event families include:

```text
conversation:join
conversation:leave

draft:update
draft:clear

message:commit
message:created

presence:update
```

A live draft update should contain enough information to identify the conversation, author, draft, and ordering/version information.

Example conceptual payload:

```ts
interface DraftUpdate {
  conversationId: string;
  authorId: string;
  draftId: string;
  revision: number;
  text: string;
  clientTimestamp: number;
}
```

The server should generally derive or validate authoritative identity rather than trusting a client-supplied `authorId` once authentication is introduced.

`revision` allows clients to ignore stale or reordered updates.

A committed message is a separate domain object:

```ts
interface CommitMessageRequest {
  conversationId: string;
  clientMessageId: string;
  text: string;
}
```

The server responds/broadcasts an authoritative message object containing the server-generated ID and timestamp.

## Draft lifecycle

A draft is temporary shared state.

A typical lifecycle is:

```text
user begins typing
      ↓
draft:update revision 1
      ↓
draft:update revision 2
      ↓
draft:update revision 3
      ↓
recipient sees draft evolving
      ↓
user presses Send
      ↓
message:commit
      ↓
server creates authoritative message
      ↓
message:created
      ↓
live draft disappears and committed message remains
```

If the user deletes the entire draft, leaves the room, becomes inactive for a configured period, or disconnects, the recipient should eventually receive `draft:clear` or equivalent behavior.

## State model

The system should distinguish at least three categories of state.

### Local interaction state

Examples:

- cursor position
- selection
- unsent editor content
- current viewport

This primarily lives in the browser.

### Ephemeral shared state

Examples:

- live drafts
- online presence
- typing activity

This may temporarily exist in backend memory and should not initially require a database.

### Durable state

Examples:

- users
- conversations
- conversation membership
- committed messages

This will eventually live in persistent storage.

## Persistence

Persistence should not be required for the earliest real-time proof of concept.

When persistence is introduced, use PostgreSQL unless a concrete requirement suggests otherwise.

A likely initial model includes:

- users
- conversations
- conversation_members
- messages

Live draft revisions should not normally be stored in the `messages` table.

A separate ephemeral store may be introduced later if the backend becomes horizontally distributed.

## Horizontal scaling

The first implementation can run as one Node process.

If multiple backend instances are introduced later, Socket.IO room events and transient draft state will need coordination across processes.

Redis is the likely first scaling component, using a Socket.IO Redis adapter or equivalent publish/subscribe mechanism.

Conceptually:

```text
Frontend clients
      ↓
Load balancer
   ↓       ↓
Node A   Node B
   \       /
      Redis
       |
   PostgreSQL
```

Redis should not be introduced until there is an actual need for multiple real-time server instances.

## Message ordering and concurrency

Live typing produces a high frequency of mutable state updates. The system must tolerate network delay and messages arriving out of order.

Each draft stream should therefore have a monotonically increasing revision or sequence number.

A client receiving revision 15 after revision 16 should ignore revision 15.

Committed messages should receive authoritative server timestamps and IDs.

## Performance requirements

The live typing path should be optimized for latency rather than durability.

The target should be that another participant perceives updates essentially as they occur.

Implementation should avoid:

- database writes for every character
- HTTP requests for every draft revision
- expensive server-side transformations on the hot draft-update path
- unnecessary serialization of conversation history with every update

Payloads should be small and scoped to the active draft.

A modest throttle may be introduced if measurements show one event per browser input event creates unnecessary network load, but perceived live typing must remain the primary UX requirement.

## Security considerations

Even during early development, the protocol should assume clients are untrusted.

The backend should eventually enforce:

- authentication
- conversation membership authorization
- maximum draft/message sizes
- event-rate limits
- schema validation
- sanitization/escaping at rendering boundaries
- connection limits

A client must never be allowed to subscribe to arbitrary conversation IDs simply by guessing them.

Live typing also creates a stronger privacy implication than ordinary chat because text may be transmitted before the sender commits to sending it. This must eventually be made explicit in product UX and privacy documentation.

## Privacy implications of live typing

This product intentionally transmits text while it is being composed.

That means recipients may see text that the sender later deletes or chooses not to send.

The application should make this behavior obvious to users rather than presenting the composer as a private draft field.

Future requirements should separately define:

- whether live drafts are retained anywhere
- whether they may be logged
- whether analytics may observe draft contents
- whether encryption is end-to-end
- how screenshots/recording concerns are communicated
- whether users can disable live typing for a conversation

The initial architectural default should be that transient drafts are not persisted or logged as message content.

## Testing strategy

When implementation begins, tests should cover both domain behavior and real-time interaction.

Backend tests should verify:

- room isolation
- ordered draft updates
- stale revisions being ignored
- draft cleanup on disconnect
- conversion from draft to committed message

Frontend tests should verify:

- remote draft rendering
- committed-message transition
- editing operations such as deletion and paste
- reconnection behavior

End-to-end tests should eventually open two browser sessions and verify that typing in one is reflected live in the other.

## Initial development sequence

The recommended implementation sequence is:

1. initialize a modern TypeScript frontend and backend
2. define shared protocol types
3. establish Socket.IO connectivity
4. implement joining a single development conversation room
5. implement `draft:update`
6. render another participant's evolving draft
7. implement `message:commit` and `message:created`
8. distinguish visually between transient drafts and committed messages
9. add tests for ordering and disconnect cleanup
10. only then introduce database persistence and authentication

## Deferred components

Do not introduce these until needed:

- Redis
- microservices
- Kubernetes
- message queues
- event streaming platforms such as Kafka
- complex state-management frameworks
- distributed databases

The central technical goal of the first milestone is simply:

> Two browser clients can join the same conversation, and each can see the other's draft evolve in near real time while typing, followed by an explicit transition from live draft to committed message when Send is pressed.
