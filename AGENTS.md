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
```

## Project Structure
- `src/coerce.js` - Main coercion logic (exports `coerce` function)
- `src/helpers.js` - Helper functions (internal use)
- `src/constants.js` - Constants and patterns
- `dist/` - Built files (CJS, ESM, UMD, minified)
- `types/` - TypeScript declarations

## Code Style
- Tabs for indentation
- Double quotes for strings
- No semicolons (automatic insertion)
- JSDoc comments for exported functions

## Testing
Tests are in `tests/` directory. Run with `npm test`.

## Options
`coerce(arg, deep=false, options={})` accepts an options object:
- `maxDepth` - Maximum recursion depth (default: 100)
- `maxStringSize` - Maximum string size in bytes (default: 10000)
- `coerceBoolean` - Enable/disable boolean coercion (default: true)
- `coerceNull` - Enable/disable null coercion (default: true)
- `coerceUndefined` - Enable/disable undefined coercion (default: true)
- `coerceNumber` - Enable/disable number coercion (default: true)
- `coerceObject` - Enable/disable JSON object/array coercion (default: true)

## Git Workflow
- Use `--no-verify` to skip husky hooks when needed
- Push to `tweaks` branch for development changes
