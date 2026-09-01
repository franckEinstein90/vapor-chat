# Frontend

This directory is reserved for the browser client for Vapor Chat.

The intended first implementation is React + Vite + TypeScript.

The frontend will eventually be responsible for:

- joining a conversation;
- composing a message;
- capturing draft changes from the browser `input` event;
- transmitting live draft snapshots to the backend;
- rendering each remote participant's current live draft;
- rendering committed messages separately from transient drafts;
- showing connection and reconnection state.

No frontend implementation is intentionally included in this scaffold yet.

See `.requirements/` for the current behavioral requirements before adding application code.
