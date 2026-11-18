# Project memory

## Product intent & audience

- Telegram-style group bot with photo pinning feature; users reply `تثبيت` to a photo in a group to pin it.
- Primary user language: Arabic (command keyword `تثبيت`).
- Bot includes multiple named sub-features (e.g. `فلاش` for member welcome).

## Brand personality & voice

- Developer-facing status updates; concise, factual, no marketing tone.

## Visual design & UX direction

- No direct UI; interaction is via chat commands in groups.
- Core interaction pattern: reply to a target photo with `تثبيت` to pin it.
- `فلاش` welcome sends an animated image (GIF/sticker) to new members.

## Decisions, constraints & rationale

- Pins are stored in memory only — no persistence layer for pins.
- Pins are cleared on bot disconnect; nothing restored on login/restart.
- Rationale: avoid stale pins after restarts; pins only valid for current session.
- Command list updated and build verified passing.
- `حالة` (status) command added: shows connection status, bot status, uptime, RAM usage, CPU usage, and query time.
- Welcome command name corrected from `زيد` to `فلاش`; Flash welcomes members and sends animated image.
- Dependency install blocked in current sandbox due to unreachable package download address; tests requiring deps did not run.
- Bot cannot be started from the assistant's environment; must be run/restarted by the user.

## Open questions & assumptions

- Assumption: pinning is limited to photos (unclear if other media types supported).
- Assumption: only group context supports pinning (not DMs).
- Unverified: pin behavior after restart (manual testing required by user).
- Unknown: whether multiple concurrent pins per group are allowed.
- Unknown: bot framework/language used for implementation.
- Unknown: full command list beyond `تثبيت`, `حالة`, and `فلاش`.