# Inkspire CMS Frontend

This frontend is a `Next.js 16` application for browsing, creating, editing, and managing blog posts. It combines a public-facing reading experience with a lightweight authenticated editorial workflow.

## Overview

- Framework: `Next.js` App Router with `React 19` and `TypeScript`
- Styling: `Tailwind CSS v4`
- Forms and validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- Data fetching: `axios`
- UI utilities: Radix UI primitives, `lucide-react`, `sonner`
- Table engine: `@tanstack/react-table`
- Testing: `Vitest`, Testing Library, `jsdom`

The app talks directly to the deployed backend API at:

```txt
https://blog-website-tvka.onrender.com/api
```

## Main Features

- Public homepage with a grid of recent blog posts
- Blog listing page with search by title
- Blog listing page with filters for author, category, and tags
- Blog listing page with CSV export
- Blog listing page with pagination
- Individual blog detail pages
- Auth flow for signup and login
- Protected post creation and editing pages
- Delete actions for authenticated users
- Toast notifications for success and failure states
- Responsive UI for mobile, tablet, and desktop layouts

## Routes

- `/` : homepage that loads recent posts
- `/blogs` : full blog management and browsing table
- `/post/[id]` : blog post details page
- `/login` : login form
- `/signup` : account creation form
- `/add` : protected page for creating a post
- `/edit/[id]` : protected page for editing an existing post

## Authentication Behavior

Authentication is handled on the client side with `localStorage`.

- Token key: `blog-token`
- User key: `blog-user`
- Login stores the JWT token and the user email
- Protected pages use `ProtectedRoute` to redirect unauthenticated users
- Redirect behavior preserves the original path through `?redirect=...`

Protected routes currently apply to:

- `/add`
- `/edit/[id]`

Some actions on the blogs table are also gated in the UI. If the user is not logged in, the app shows a toast instead of allowing:

- add post
- edit post
- delete post

## Error Handling

Auth errors now map backend status codes to clearer toast messages.

- Login examples: `401` -> unauthorized / invalid credentials
- Login examples: `404` -> account not found
- Login examples: `429` -> too many attempts
- Signup examples: `409` -> user already exists
- Signup examples: `422` -> invalid signup details
- Signup examples: `429` -> too many attempts

Other pages also show toast notifications for failed post loads, failed saves, failed deletes, and failed CSV export.

## Project Structure

```txt
frontend/
|-- app/
|   |-- page.tsx
|   |-- blogs/page.tsx
|   |-- post/[id]/page.tsx
|   |-- login/page.tsx
|   |-- signup/page.tsx
|   |-- add/page.tsx
|   |-- edit/[id]/page.tsx
|   |-- layout.tsx
|   `-- globals.css
|-- components/
|   |-- auth/
|   |-- common/
|   |-- layout/
|   |-- posts/
|   |-- providers/
|   `-- ui/
|-- lib/
|   |-- api.ts
|   |-- auth.ts
|   |-- auth-error.ts
|   |-- schemas.ts
|   |-- types.ts
|   `-- utils.ts
`-- package.json
```

## Important Modules

- `app/layout.tsx`: configures fonts, metadata, global styles, and providers.
- `components/providers/app-providers.tsx`: mounts the global `sonner` toaster.
- `lib/api.ts`: central axios client and API request helpers.
- `lib/auth.ts`: handles token and user persistence in `localStorage`.
- `lib/auth-error.ts`: converts auth-related API failures into user-facing toast messages.
- `components/posts/blogs-table-page.tsx`: implements the searchable/filterable blog table and CSV export.
- `components/posts/post-form.tsx`: shared create/edit form for blog posts.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Testing

Current tests cover parts of the post management flow, including table behavior and the post form integration flow.

Test-related dependencies in use:

- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`
- `jsdom`

Run the full test suite with:

```bash
npm run test
```

## UI Notes

- Typography uses `Cormorant Garamond` for headings and `Manrope` for body text.
- Notifications use `sonner` with rich colors and top-right placement.
- The interface is built from small reusable UI primitives under `components/ui`.

## Current Assumptions and Limitations

- The API base URL is hardcoded in `lib/api.ts`.
- Authentication is client-only and depends on browser `localStorage`.
- There is no environment-variable based API switching documented in the current frontend.
- The protected route check is performed in the client, not on the server.

## Suggested Next Improvements

- Move the API base URL to an environment variable such as `NEXT_PUBLIC_API_BASE_URL`
- Add dedicated tests for login and signup error toast behavior
- Add empty-state and error-state documentation screenshots if this README is used for project submission or handoff
