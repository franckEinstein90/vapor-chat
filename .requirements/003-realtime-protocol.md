# Real-Time Protocol Requirements

## Design goals

The real-time protocol should remain small, explicit, and easy to inspect while the product interaction is being discovered.

Every client-originated event should include only the information needed for the server to validate and route it. The server should derive trusted connection/session information itself whenever possible rather than accepting it blindly from the browser.

## Draft updates

A draft update represents transient composition state, not a persisted chat message.

Conceptual payload:

```ts
interface DraftUpdate {
  conversationId: string;
  revision: number;
  text: string;
}
```

The server associates the update with the connected participant and broadcasts it only to the other authorized members of that conversation.

Recipients should retain the highest accepted revision for each remote participant/conversation pair and ignore stale revisions.

## Message commits

A committed message is distinct from a draft update.

Conceptual payload:

```ts
interface MessageCommit {
  conversationId: string;
  clientMessageId: string;
  text: string;
}
```

The server should acknowledge or broadcast a normalized committed-message representation. In a later persistent implementation, the server will assign durable message IDs and timestamps.

## Rate control

Do not require one network packet per physical keyboard event. The frontend may coalesce rapid edits into draft snapshots at a short interval while preserving the experience of visibly live composition.

Initial experimentation should compare immediate `input` event transmission with a very small throttle window. The remote display should remain fluid.

## Reconnection

The initial proof of concept only needs graceful connection-state handling. Later versions should define how a reconnecting participant restores conversation membership, committed history, and currently active remote drafts.

## Security constraints

- Validate payload shape and maximum draft/message length on the server.
- Never trust a client to declare another participant's identity.
- Never broadcast events outside the conversation to which the connection is authorized.
- Treat live drafts as potentially sensitive transient data.
- Do not persist live drafts by default.
