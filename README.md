# MyWorkspace — N322 Final

## Live Deployment

[Demo Site](https://workspace.projects.havenhamelin.work)

## Overview

A cross-platform Expo / React Native productivity web & mobile app. Features Firebase authentication, route protection, modular Firestore services, dynamic light/dark theming, and full CRUD for notes, tasks, and mood journal entries.

## Quick start

1) Install dependencies  
`npm install`

2) Configure Firebase (Expo public env vars)  
Create `.env.local` or export in shell:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

3) Run the app (Expo Go / simulator / web)  
`npx expo start`

## Features

- **Authentication**: Email/password authentication using Firebase Auth with formatted error handling and route protection (`/login` redirect).
- **Service-based CRUD**: Decoupled Firestore services (`notesService`, `tasksService`, `moodJournalService`) handling user-scoped collections.
- **Dashboard**: Greeting, quick metrics, recent item summaries, and inline task status updates.
- **Hub & Tools**: Interactive launcher for Notes, Tasks (with priority & completion toggling), and Mood Journal.
- **Design System & UI**: Centralized light/dark theme tokens (`styles/theme.js`), custom cards, badges, empty states, and tap scale micro-animations.
- **Cross-Platform Navigation**: Web top navigation bar for web/desktop view, native tab bar for mobile view, and stacked sub-routes.
- **Profile**: Display name updating and account management.

## App structure

- `app/_layout.jsx` – Root layout stack, theme provider, and auth guard.
- `app/(tabs)/_layout.jsx` – Main tab navigator with responsive web top nav (`WebTopNav`).
- `app/(tabs)/index.jsx` – Dashboard with live stats and quick actions.
- `app/(tabs)/hub/*.jsx` – Hub launcher and Notes, Tasks, and Mood screens.
- `app/login.jsx`, `app/register.jsx` – Auth forms with formatted error reporting.
- `app/(tabs)/settings/profile.jsx` – Profile display name editor and session logout.
- `src/services/*` – Firestore CRUD modules for notes, tasks, and mood journal.
- `src/auth/*` – AuthContext provider and error formatter (`formatAuthError.js`).
- `src/firebase/firebaseConfig.js` – Environment-driven Firebase initialization.
- `components/*` – Reusable components (`Card`, `Badge`, `EmptyState`, `Footer`, `WebTopNav`, `PrimaryButton`, `ThemeToggleButton`).
- `styles/theme.js` – Dynamic light/dark theme tokens, typography, and layout rules.

