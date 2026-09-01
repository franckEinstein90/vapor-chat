# Project Overview

## Working name

Vapor Chat

## Purpose

Vapor Chat is an experimental real-time chat system where participants can see one another composing messages as they type, rather than only receiving a message after the sender presses Send.

The core interaction is character-by-character or incremental-text communication. As a participant types, the current draft is streamed to the other participant(s) with sufficiently low latency that the conversation feels live and synchronous.

## Product idea

Traditional chat separates composition from transmission: the recipient usually sees only a typing indicator, then receives a completed message. Vapor Chat should instead treat composition itself as a shared real-time event.

A basic interaction might appear to the recipient as:

```text
I
I t
I thi
I think
I think we
I think we should...
```

The exact user experience may evolve, but the underlying requirement is that partial text is transmitted while it is being composed.

## Initial scope

The first implementation should focus on:

- a browser-based frontend;
- a Node.js/TypeScript backend;
- persistent real-time connections using WebSockets or Socket.IO;
- chat rooms or direct conversations;
- live draft synchronization;
- completed-message events;
- clear separation between transient draft state and committed message history.

## Out of scope for the initial scaffold

Do not yet implement authentication, persistence, encryption, integrations, translation, notifications, mobile clients, or production deployment.

## Development principle

Build the smallest end-to-end system that proves the central interaction: two browser clients join the same conversation, one user types, and the other user sees the draft change almost immediately.
