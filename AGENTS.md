# Tiny Coerce - Agent Instructions

## Overview
Tiny coercion library for Client or Server. Converts string values to their appropriate JavaScript types (boolean, null, undefined, number, object, array).

## Tech Stack
- **Language**: JavaScript (ES Modules)
- **Linter**: oxlint
- **Formatter**: oxfmt
- **Bundler**: rollup
- **Node**: >=6

## Commands
```bash
npm run lint      # Check linting and formatting
npm run fix       # Auto-fix linting and formatting issues
npm run build     # Full build (lint + rollup)
npm run rollup    # Build dist files only
npm test          # Run tests
```

## Project Structure
- `src/coerce.js` - Main coercion logic (exports `coerce` function)
- `src/helpers.js` - Helper functions (internal use)
- `src/constants.js` - Constants and patterns
- `dist/` - Built files (CJS, ESM, UMD, minified)
- `types/` - TypeScript declarations
- `tests/` - Test files

## Code Style
- Tabs for indentation
- Double quotes for strings
- No semicolons (automatic insertion)
- JSDoc comments for exported functions

## Testing
Tests are in `tests/` directory. Run with `npm test`.
- `tests/coercion_test.js` - Main coercion tests
- `tests/helpers_test.js` - Helper function tests

## API
`coerce(arg, deep = false, options = {})` accepts:
- `arg` {*} - The value to coerce
- `deep` {boolean} - Whether to recursively coerce nested values (default: false)
- `options` {Object} - Coercion options
  - `maxDepth` - Maximum recursion depth (default: 100)
  - `maxStringSize` - Maximum string size in bytes (default: 100000)

## Coercion Order
1. Boolean true: `"true"` (case-insensitive)
2. Boolean false: `"false"` (case-insensitive)
3. Null: `"null"` (case-insensitive)
4. Undefined: `"undefined"` (exact match)
5. Number: Any numeric string
6. JSON: Objects, arrays, or strings via JSON.parse()
7. Fallback: Return trimmed string

## Git Workflow
- Use `--no-verify` to skip husky hooks when needed
- Push to `tweaks` branch for development changes

## Constants
- `MAX_DEPTH = 100` - Maximum recursion depth
- `MAX_STRING_SIZE = 100000` - Maximum string size in bytes (100KB)
