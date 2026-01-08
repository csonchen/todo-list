# Todo List Application - Copilot Instructions

## Project Overview

This is a full-stack Todo List application consisting of:
- **Client**: React 19 frontend with Vite, Tailwind CSS v4
- **Server**: Node.js Express backend with better-sqlite3 database

The application allows users to manage their daily tasks with create, read, update, and delete operations.

## Technology Stack

### Client (Frontend)
- **Framework**: React 19.2.0 with React DOM
- **Build Tool**: Vite 5.4.11
- **Styling**: Tailwind CSS 4.1.18 with PostCSS
- **Linting**: ESLint 9.39.1 with React Hooks and React Refresh plugins
- **Module Type**: ES Modules

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: better-sqlite3 12.5.0 (SQLite)
- **Middleware**: CORS 2.8.5

### Package Manager
- **ALWAYS use `pnpm`** for dependency management (not npm or yarn)
- Both client and server have specific `pnpm.onlyBuiltDependencies` configurations

## Project Structure

```
/
├── client/           # React frontend application
│   ├── src/
│   │   ├── App.jsx   # Main application component
│   │   ├── main.jsx  # Entry point
│   │   └── assets/   # Static assets
│   ├── public/       # Public assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
└── server/           # Express backend application
    ├── server.js     # Main server file with API routes
    ├── todos.db      # SQLite database (auto-generated)
    └── package.json
```

## Development Commands

### Server
```bash
cd server
pnpm install      # Install dependencies
node server.js    # Start server on http://localhost:3001
```

### Client
```bash
cd client
pnpm install      # Install dependencies
pnpm run dev      # Start dev server on http://localhost:5173
pnpm run build    # Build for production
pnpm run lint     # Run ESLint
pnpm run preview  # Preview production build
```

## Coding Conventions & Best Practices

### React/Frontend
1. **Component Style**: Use functional components with React Hooks
2. **State Management**: Use `useState` and `useEffect` for component state
3. **Optimistic UI Updates**: Implement optimistic updates for better UX (see App.jsx patterns)
4. **Error Handling**: Always include try-catch blocks for async operations with console.error
5. **Loading States**: Track loading states (`isLoading`, `isAdding`, etc.) for async operations
6. **Inline SVG Icons**: Define SVG icons as React components in the same file (see Icons pattern)
7. **Styling**: Use Tailwind CSS utility classes (no CSS modules or styled-components)
8. **CSS Classes**: Use string literals for className with proper conditional logic using template literals
9. **Accessibility**: Include `aria-label` attributes for icon buttons

### Code Style
1. **Quotes**: Use single quotes for strings
2. **Semicolons**: Include semicolons at the end of statements
3. **Indentation**: 2 spaces
4. **Line Length**: Keep reasonable line lengths, wrap when necessary
5. **Destructuring**: Use destructuring for props and state when appropriate
6. **Arrow Functions**: Prefer arrow functions for callbacks and functional components

### API & Backend
1. **REST API**: Follow RESTful conventions
   - GET `/api/todos` - Retrieve all todos
   - POST `/api/todos` - Create new todo
   - PATCH `/api/todos/:id` - Update todo (used for toggling completion)
   - DELETE `/api/todos/:id` - Delete todo
2. **Response Format**: Return JSON with proper status codes
   - 200 for successful GET/PATCH
   - 201 for successful POST (creation)
   - 400 for bad requests
   - 404 for not found
   - 500 for server errors
3. **Error Handling**: Always include try-catch blocks and return appropriate error responses
4. **Database**: Use prepared statements for all SQL queries (security and performance)
5. **Boolean Handling**: Convert SQLite integers (0/1) to JavaScript booleans when sending responses

### Database Schema
```sql
todos table:
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- text: TEXT NOT NULL
- completed: INTEGER DEFAULT 0 (0 = false, 1 = true)
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
```

### State Management Patterns
- **Optimistic Updates**: Update UI immediately, then sync with server, revert on failure
- **Temporary IDs**: Use `Date.now()` for temporary IDs during optimistic updates
- **Sorting**: Keep todos sorted by `created_at DESC` (newest first)

### Testing & Quality
1. **Linting**: Run `pnpm run lint` in client before committing
2. **Type Safety**: While not using TypeScript, write type-safe code with JSDoc comments when beneficial
3. **Console Logging**: Use `console.error` for errors, avoid excessive console.log in production code

## Network & Configuration
- **Server Port**: 3001 (hardcoded)
- **Client Dev Port**: 5173 (Vite default)
- **CORS**: Enabled on server for cross-origin requests
- **API Base URL**: `http://localhost:3001` (hardcoded in client)

## Constraints & Restrictions
1. **Package Manager**: ONLY use `pnpm` (never npm or yarn)
2. **No TypeScript**: Project uses plain JavaScript
3. **No Testing Framework**: No test infrastructure is set up
4. **Database**: Use SQLite via better-sqlite3, not other databases
5. **Module System**: Client uses ES Modules (type: "module")
6. **CSS Framework**: Use Tailwind CSS only, no other CSS frameworks or CSS-in-JS

## UI/UX Guidelines
1. **Design**: Modern, clean interface with rounded corners (rounded-2xl, rounded-3xl)
2. **Colors**: Primary color is indigo (indigo-500, indigo-600, indigo-700)
3. **Animations**: Use `transition-all` and `duration-*` classes for smooth transitions
4. **Hover States**: Add hover effects with increased shadow and border changes
5. **Empty States**: Include helpful empty state messages with icons
6. **Loading States**: Use skeleton loaders or loading indicators
7. **Responsive**: Use responsive design classes (already implemented)

## Git & Version Control
- Follow conventional commit message format when possible
- Keep commits focused and atomic
- Branch from main for new features

## Important Notes
- The application uses optimistic UI patterns extensively for better perceived performance
- All database operations use synchronous better-sqlite3 API (not async)
- The client uses `fetch` API for HTTP requests (no axios or other libraries)
- Icons are inline SVG components, not icon libraries
