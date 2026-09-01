# Live Typing Requirements

## Goal

Participants in the same conversation must be able to see one another's message drafts evolve while they are being typed.

## Functional requirements

1. The frontend captures changes to the active message draft.
2. Draft changes are transmitted over a persistent real-time connection without requiring the sender to press Send.
3. Other participants in the same conversation receive those changes and render the current draft state for the originating participant.
4. Backspace, deletion, replacement, selection edits, and paste operations must be represented correctly; the system must not assume that every update is a single appended character.
5. When the sender commits the message, the draft becomes a completed message event.
6. After a message is committed, the sender's transient live-draft state is cleared.
7. Live draft updates are scoped to the correct conversation and sender.
8. Participants must never receive draft updates from conversations they have not joined.

## Initial synchronization model

For the first implementation, prefer transmitting the current draft text or a small versioned draft snapshot rather than inventing an operational-transform or CRDT system. Correctness and simplicity are more important than minimizing every byte.

A draft update can conceptually contain:

```ts
interface DraftUpdate {
  conversationId: string;
  participantId: string;
  revision: number;
  text: string;
}
```

The exact contract can change during implementation.

## Latency

The interaction should feel immediate on a normal network connection. Client-side throttling or debouncing may be used if necessary, but it should not make the remote typing experience noticeably lag behind the sender.

## Ordering

Draft updates must carry enough ordering information to prevent delayed network packets from replacing newer text with older text. A monotonically increasing revision number per sender/conversation is sufficient for the initial implementation.

## Presence

The system may expose typing/active presence later, but a conventional `user is typing...` indicator is not the main feature. The live draft itself is the primary presence signal.

## Completion criteria

This requirement is proven when two browser sessions can join the same conversation and one participant can watch the other participant's draft evolve correctly through typing, deleting, editing, pasting, and finally sending the message.
