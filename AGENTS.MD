# SCP Game UI Agent Guide

This repository is for a local in-game web UI used by an Unreal Engine title in an SCP horror setting. It is **not** a public website. Agents working here should optimize for game UI behavior, runtime reliability, and clear cross-system contracts rather than typical web-site conventions.

## Project Intent

- The game launches the local web UI as part of the game runtime.
- Communication between Unreal Engine and the UI is primarily through a **binary WebSocket protocol using protobuf**.
- Unreal may also expose an **HTTP server** for assets such as images and localized text.
- The UI must feel like a native game interface, not a browser page.
- No default browser scrolling behavior should be assumed.
- The UI will include:
  - multiple pages and flows such as menu, lobby, in-game, pause, and settings
  - HUD elements
  - world-anchored 2D labels such as nicknames over 3D positions
  - mini-games embedded in the main game UI
  - custom visual components prefixed with `G` such as `GText`, `GCombo`, `GProgress`

## Core Rules

1. Treat the UI as part of the game client, not a marketing site.
2. Prefer custom interaction patterns that fit gameplay needs.
3. Avoid browser-default assumptions about scrolling, layout, or navigation.
4. Keep the Unreal-to-UI contract explicit and stable.
5. Build for multiple distinct UI contexts from the start.
6. Favor reusable `G*` components for all visual primitives.

## Working Style For Agents

- Read this file first before making any changes.
- Do not assume browser-first UX patterns are desirable.
- Do not introduce a new CSS framework (Like bootstrap) unless explicitly requested later.
- Do not add unrelated site-like pages, blog patterns, or generic landing-page behavior.
- If a design decision affects gameplay feel, call it out clearly before implementing it.
- Prefer small, composable UI systems over one-off page hacks.

## Architecture Expectations

### Communication

- Use protobuf messages over binary WebSocket for runtime UI/game interaction.
- Treat message schemas as contracts.
- Keep request/response and event streams clearly separated where possible.
- Assume latency, reconnects, partial updates, and state resyncs can happen.

### HTTP Asset Delivery

- Unreal may serve images and localization data over HTTP.
- UI should treat these as runtime resources, not build-time only assets.
- Handle missing, late, or updated resources gracefully.

### Layout and Scrolling

- The UI must own its scrolling behavior.
- Do not rely on browser page scroll for game screens.
- If a scroller is needed, implement it intentionally for the game UI.
- Favor layout containers that work in fixed HUD, modal, and panel contexts.

### Pages and Runtime Layers

The UI will likely have several layers or routes:

- global shell
- menu and lobby screens
- in-game HUD
- pause and overlay menus
- mini-game surfaces
- floating world-space labels and markers

Agents should design with layer separation in mind so these systems can coexist without fighting each other.

## Component Conventions

- Use `G` as the prefix for custom UI components.
- Prefer names that describe role, not implementation.
- Examples:
  - `GText`
  - `GButton`
  - `GCombo`
  - `GProgress`
  - `GPanel`
  - `GModal`
  - `GScroller`
  - `GToast`
- Keep component APIs narrow and explicit.
- Reuse common visual primitives across all screens.

### Preferred Component Selection

Use the smallest `G*` element that fits the job.

- Text and labels: `GText`, `GLabel`
- Buttons and tokens: `GButton`, `GChip`, `GBadge`, `GToolbar`
- Forms and inputs: `GInput`, `GTextarea`, `GNumberInput`, `GSlider`, `GSwitch`, `GCheckbox`, `GRadio`, `GCombo`, `GKeybindInput`, `GField`
- Containers and layout blocks: `GSection`, `GCard`, `GPanel`, `GTile`, `GWindow`
- Navigation and selection: `GBreadcrumbs`, `GTabs`, `GPagination`, `GRail`, `GAccordion`
- Menus and action lists: `GMenuList`, `GList`, `GListItem`
- Runtime feedback and status: `GAlert`, `GBanner`, `GToast`, `GEmptyState`, `GLoading`, `GSkeleton`, `GProgress`, `GStat`
- Visual helpers and primitives: `GIcon`, `GAvatar`, `GDivider`, `GPopover`, `GTooltip`, `GScroller`

Rules of thumb:

- Prefer `GText` and `GLabel` for readable text instead of plain browser typography.
- Prefer `GButton`, `GChip`, and `GToolbar` for compact action rows and quick in-game commands.
- Prefer `GAlert`, `GBanner`, and `GToast` for feedback, warnings, and notifications rather than custom ad hoc boxes.
- Prefer `GSection`, `GPanel`, `GCard`, `GTile`, and `GWindow` for grouped content or framed surfaces instead of generic `div` containers.
- Prefer `GTabs`, `GBreadcrumbs`, `GPagination`, `GRail`, `GAccordion`, and `GMenuList` for navigation, paging, and choice browsing instead of browser-native controls.
- Prefer `GInput`, `GTextarea`, `GNumberInput`, `GSlider`, `GSwitch`, `GCheckbox`, `GRadio`, `GCombo`, and `GKeybindInput` for settings and runtime forms instead of raw HTML inputs unless the user asks otherwise.
- Prefer `GLoading`, `GSkeleton`, `GEmptyState`, `GProgress`, and `GStat` for runtime state, loading, and readouts.
- Prefer `GPopover`, `GTooltip`, `GIcon`, `GAvatar`, and `GDivider` for compact helpers and visual structure.

## UI Behavior Principles

- Make important game states immediately visible.
- Support input methods relevant to games, including mouse, keyboard, and controller if the project adds them.
- Avoid heavy motion that hurts readability during play.
- Keep HUD elements compact and non-invasive.
- Make overlays easy to open and close without losing game context.
- Support partial updates without forcing full-screen rerenders when possible.

## Styling Guidance

- Use custom CSS, not a framework.
- Build a consistent game-specific visual language.
- Prefer predictable layout rules over clever CSS tricks.
- Keep styles centralized enough that the game can maintain one coherent look.
- Separate theme tokens, spacing, typography, and motion concerns where practical.
- Use `rem` for typography, spacing, and most component sizing.
- Use `%`, `vh`, `vw`, and `fr` for layout.
- Use `px` only for sharp details that benefit from exact device pixels, like 1px borders, hairlines, icon nudges, and some debug/demo boards.

## Mini-Game Expectations

- Mini-games are first-class UI surfaces, not special-case hacks.
- They may need their own interaction loops, state machines, and temporary UI primitives.
- Design them so they can be mounted inside the larger UI shell without leaking state.

## Safety And Change Discipline

- If a change touches protobuf schemas, WebSocket message flow, or runtime state sync, treat it as high impact.
- If a change alters global interaction patterns like scrolling, focus, or layering, check the downstream effect on all pages.
- Keep changes scoped unless the user explicitly asks for a broader refactor.
- When uncertain, preserve compatibility with existing Unreal-side expectations.

## When In Doubt

Ask:

- Does this feel like a game UI?
- Is this compatible with binary WebSocket/protobuf runtime communication?
- Does it work across menu, HUD, overlay, and mini-game contexts?
- Does it avoid browser-default behavior that would feel wrong in-game?
