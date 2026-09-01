# Backend

This directory is reserved for the real-time chat server for Vapor Chat.

The intended first implementation is Node.js + TypeScript with Socket.IO unless a later requirement changes that decision.

The backend will eventually be responsible for:

- accepting real-time client connections;
- managing conversation/room membership;
- receiving and validating live draft updates;
- routing live drafts to the appropriate conversation participants;
- handling committed-message events;
- preventing stale or unauthorized updates from being broadcast;
- managing connection/disconnection lifecycle.

Live draft state should remain ephemeral by default. Persistence, authentication, durable message history, and production infrastructure are intentionally deferred.

See `.requirements/` before adding implementation code.
