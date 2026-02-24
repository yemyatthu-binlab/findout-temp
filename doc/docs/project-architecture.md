---
sidebar_position: 3
---

# Project Architecture

## High-Level Overview

```
- `src/` — All application code (screens, components, hooks, services)
- `src/components/` — Custom reusable components
- `src/context/` — Global state & providers
- `src/hooks/` — Custom reusable hooks
- `src/navigation/` — Navigation stacks, tabs, routes
- `src/services/` - Service files for API fetching
- `src/store/` - Global state
- `src/translations/` - Translations
- `src/types/` - Queries types, navigation types, project API response types
- `src/utils/` — Helper utilities
- `assets/` — Images, fonts, icons
- `android/` — Native Android project
- `ios/` — Native iOS project
```

## Folder Responsibilities

### `src/`

Main application source code. All core logic lives here.

### `src/components/`

Reusable UI components such as buttons, inputs, cards, and shared layout elements.  
Keep components small and stateless when possible.

### `src/context/`

React Context providers used for global state that must be accessible throughout the app.

### `src/hooks/`

Custom reusable hooks:

- API hooks (e.g., `useAccountInfo`)
- UI hooks (e.g., `useGradualAnimation`)
- Logic hooks (e.g., `useStatus`)

### `src/navigation/`

All navigation setup, including stack navigators, tab navigators, navigation types, and app entry navigation flow.

### `src/services/`

Business logic modules for API service calls and data formatting/parsing.  
Keep API functions organized by feature (e.g., `auth.service.ts`, `profile.service.ts`).

### `src/store/`

Global state management. Store files should contain app-wide state, actions, and selectors.

### `src/translations/`

All translation JSON files, organized per language (e.g., `en/translation.json`, `fr/translation.json`).

### `src/types/`

TypeScript types, including API response types, navigation types, and shared utility types.

### `src/utils/`

Helper utilities and formatter functions such as date/time helpers, string helpers, and validation helpers.

### `assets/`

Static assets like images, icons, and fonts.

### `android/` & `ios/`

Native platform-specific code and build configuration.
