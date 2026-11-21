# Project memory

## Product intent & audience

- Telegram-style group bot with photo pinning feature; users reply `تثبيت` to a photo in a group to pin it.
- Primary user language: Arabic (command keyword `تثبيت`).
- Bot includes multiple named sub-features (e.g. `فلاش` for member welcome).

## Brand personality & voice

- Developer-facing status updates; concise, factual, no marketing tone.
- Bot author/developer alias: **Zedhellking**.

## Visual design & UX direction

- No direct UI; interaction is via chat commands in groups.
- Core interaction pattern: reply to a target photo with `تثبيت` to pin it.
- `فلاش` welcome sends an animated image (GIF/sticker) to new members.
- `حالة` status message ends with a decorative signature line: `༺═━━━ 𝑩𝒚 : 𝒁𝒆𝒅𝒉𝒆𝒍𝒍𝒌𝒊𝒏𝒈 ━━━═༻`.
- Decorative/stylized text (Unicode symbols, special fonts) is acceptable for bot-facing chat output.

## Decisions, constraints & rationale

- Pins are stored in memory only — no persistence layer for pins.
- Pins are cleared on bot disconnect; nothing restored on login/restart.
- Rationale: avoid stale pins after restarts; pins only valid for current session.
- `حالة` (status) command: shows connection status, bot status, uptime, RAM usage, CPU usage, query time, and ends with decorative `by : Zedhellking` signature.
- Welcome command name corrected from `زيد` to `فلاش`; Flash welcomes members and sends animated image.
- Signature added to `حالة` output; command verified and build passing.
- Dependency install blocked in current sandbox due to unreachable package download address; tests requiring deps did not run.
- Bot cannot be started from the assistant's environment; must be run/restarted by the user.

## Open questions & assumptions

- Assumption: pinning is limited to photos (unclear if other media types supported).
- Assumption: only group context supports pinning (not DMs).
- Unverified: pin behavior after restart (manual testing required by user).
- Unknown: whether multiple concurrent pins per group are allowed.
- Unknown: bot framework/language used for implementation.
- Unknown: full command list beyond `تثبيت`, `حالة`, and `فلاش`.