# SCP Front UI Component Guide

This project is an in-game web UI for an Unreal Engine SCP horror game. The components below are the primary building blocks for menus, lobbies, HUD, overlays, and mini-games.

## How To Use

- Use the smallest component that fits the job.
- Prefer `G*` components over raw HTML for anything player-facing.
- Keep layouts game-like, compact, and runtime-safe.
- Use browser-native elements only when a `G*` component does not exist yet.

## Element Reference

| Component | Use it for | Notes |
| --- | --- | --- |
| `GText` | Body copy, headings, technical text, caps, handwritten notes | Use for all visible text roles. |
| `GLabel` | Field labels, section captions, tags | Good for short descriptors and form labels. |
| `GButton` | Primary actions, confirm/cancel, navigation commands | Use for clickable commands and tool actions. |
| `GChip` | Compact selectable tokens, filters, removable tags | Better than a badge when selection matters. |
| `GBadge` | Tiny status marks and read-only labels | Smaller and flatter than `GChip`. |
| `GToolbar` | Compact action rows and HUD strips | Use for grouped actions in one line. |
| `GInput` | Single-line text entry | For names, search, codes, and short values. |
| `GTextarea` | Long text entry | For notes, logs, chat, and briefing text. |
| `GNumberInput` | Integer and float entry | Good for counts, amounts, and tuning values. |
| `GSlider` | Ranged numeric controls | Best for volumes, sensitivity, and thresholds. |
| `GSwitch` | On/off settings | Use for toggles with a clear runtime state. |
| `GCheckbox` | Boolean settings with labels | Good for settings lists and options groups. |
| `GRadio` | Exclusive choice controls | Use when exactly one option should be selected. |
| `GCombo` | Dropdown selection | Good for moderate option lists and settings. |
| `GKeybindInput` | Hotkeys and key combinations | Use for control rebinding and shortcuts. |
| `GField` | Labeled input wrapper | Use to combine label, helper, and control. |
| `GSection` | Grouped settings or content blocks | Good for named subsections inside pages. |
| `GCard` | Framed content card | Use for summaries, slots, and reusable panels. |
| `GPanel` | Lightweight reusable container | Good for nested content blocks and dashboards. |
| `GTile` | Small HUD-style content block | Good for compact runtime tiles and stat snippets. |
| `GWindow` | Larger framed screen panel | Use for settings, inventory, and overlay windows. |
| `GBreadcrumbs` | Navigation trails | Use for menu hierarchy and nested locations. |
| `GTabs` | Page switching within one surface | Best for menu, lobby, HUD, and pause tabs. |
| `GPagination` | Page navigation | Use for logs, tables, inventories, and paged lists. |
| `GRail` | Dense choice rails | Good for quality presets and option lines. |
| `GAccordion` | Collapsible grouped content | Use for lore, settings clusters, and folded details. |
| `GMenuList` | Action menus and selectable lists | Good for pause menus, dropdown-like lists, and command lists. |
| `GList` | Structured lists | Use for bullets, numbered lists, or plain list blocks. |
| `GListItem` | One row inside a list | Use as the child item for `GList`. |
| `GAlert` | Inline warnings and notices | Best for compact warnings and confirmations. |
| `GBanner` | Wide announcements and important notices | Use for top-level messages and round-start info. |
| `GToast` | Notification cards | Use for transient feedback and system events. |
| `GEmptyState` | Empty result states | Use when content is missing or filtered away. |
| `GLoading` | Loading placeholder with spinner | Use while waiting for runtime data. |
| `GSkeleton` | Skeleton placeholders for blocked content | Use when content shape is known but data is not ready. |
| `GProgress` | Progress and completion readouts | Use for loading, health, tasks, or objectives. |
| `GStat` | One label and one value runtime readout | Use for HUD summaries and small metric tiles. |
| `GIcon` | Icons and SVG/image icons | Use for UI glyphs, image assets, and icon slots. |
| `GAvatar` | Player portraits and initials fallback | Use for roster, chat, HUD, and team presence. |
| `GDivider` | Separators and visual splits | Use to split groups and dense menu rows. |
| `GPopover` | Floating contextual panels | Use for quick details, small menus, and tool popups. |
| `GTooltip` | Hover/focus hints | Use for short explanations and helper text. |
| `GScroller` | In-game scrolling container | Use whenever a section needs its own scroll behavior. |

## Design Notes

- Keep the UI transparent where needed so the game remains visible behind it.
- Avoid browser-default page scrolling for game surfaces.
- Prefer compact, readable layouts with explicit component roles.
- Use the `G*` primitives consistently so future runtime pages feel like one system.
