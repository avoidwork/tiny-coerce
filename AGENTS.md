# AGENTS.md

Rules and principles for agents working on **this** project.

---

## 1. Core Rules

### 1.0 Document Conventions

When updating this document, append new information or sections. Do NOT delete or overwrite existing content unless explicitly directed. Always ask before making structural changes. When in doubt, keep it.

### 1.1 Forbidden Patterns

The following are **strictly prohibited**:

- Hardcoded secrets, API keys, or credentials.
- `console.log()` statements in production code (use a proper logger).
- `catch (e) {}` bare catches that swallow errors silently.
- `eval()`, `Function()`, `__import__()` at any level.
- `*` imports in CommonJS (`require("x")` without destructuring).
- Mutating a list while iterating over it.
- Blocking I/O operations inside async contexts.
- Bypassing the auth middleware.

### 1.2 Security Rules

Follow the [OWASP Top 10](https://owasp.org/www-project-top-10/) for every piece of code written:

- Every route MUST pass through authentication middleware.
- Never store plaintext secrets. Use environment variables.
- Use parameterized queries. Validate and sanitize all user input.
- File uploads must pass whitelist + MIME validation.
- All defaults must be production-safe. No `DEBUG=true` in non-local configs.
- Implement secure token verification. Reject tokens with weak algorithms.
- Log at structured JSON level. Strip PII before logging.
- Validate all outbound tool URLs against an allowlist. Disallow `file://`, `gopher://`, `dict://` schemes.

### 1.3 Git Operations

- **Never rebase under any circumstance without explicit agreement from the user.** Never assume your decision is correct.
- **Never push to any branch without explicit user approval.** Git changes (checkout, reset, revert, amend) are local operations — do not auto-push. Always ask "Push to remote?" before running `git push`.
- Never force push.

### 1.4 Core Principles

- **DRY**: Extract repeated logic into functions. Centralize configuration. Reuse formatting, error handling, and validation utilities across modules. No copy-paste code blocks greater than three lines.
- **KISS**: Prefer simple, readable code over clever solutions. If a solution requires more than three levels of indentation or a helper function with more than 10 lines, reconsider it.
- **YAGNI**: Do NOT build features, abstractions, or configurations not required by the current spec. No generic "future-proof" wrappers. Ad-hoc solutions are acceptable as long as they serve a present requirement.
- **Single Responsibility**: Each module, class, and function must have one reason to change.
- **Open/Closed**: Extend via composition — not by modifying existing logic.
- **Dependency Inversion**: Depend on abstractions (interfaces / protocols) for external services. Inject implementations.

---

## 2. Project Context

Tiny coercion library for Client or Server. Converts string values to their appropriate JavaScript types (boolean, null, undefined, number, object, array).

Great for DOM data attributes, localStorage, and other cases where you need to store strings that represent typed values.

### 2.0 Expected Project Layout

```
tiny-coerce/
├── src/
│   ├── coerce.js      - Main entry point, exports `coerce()` function
│   ├── helpers.js     - Type-checking helpers (isTrue, isFalse, isNull, etc.)
│   └── constants.js   - Shared constants (MAX_DEPTH, MAX_STRING_SIZE, etc.)
├── dist/
│   ├── tiny-coerce.js    - ESM bundle
│   └── tiny-coerce.cjs   - CommonJS bundle
├── types/
│   └── coerce.d.ts       - TypeScript type declarations
├── tests/
│   ├── coercion_test.js  - Main coercion tests
│   └── helpers_test.js   - Helper function tests
├── coverage.txt          - Coverage report
├── package.json          - Package manifest and scripts
├── rollup.config.js      - Bundler configuration
├── AGENTS.md             - Agent instructions
└── README.md             - User documentation
```

### 2.1 Quick Commands

| Command        | Purpose                                     |
|----------------|---------------------------------------------|
| `npm test`     | Run tests with Node's built-in test runner  |
| `npm run lint`  | Check linting and formatting with oxlint/oxfmt |
| `npm run fix`   | Auto-fix linting and formatting issues      |
| `npm run build` | Full build (lint + rollup bundling)         |
| `npm run rollup`| Build dist bundles only                     |
| `npm run coverage` | Run tests and generate coverage report   |

---

## 3. JavaScript Conventions

### 3.1 Language & Tooling

- **JavaScript**: ES Modules (`"type": "module"` in `package.json`)
- **Runtime**: Node.js >= 6
- **Package manager**: `npm` — the only supported package manager.
- **Linting**: `oxlint` — fast JavaScript linter
- **Formatting**: `oxfmt` — formatter for JavaScript/TypeScript
- **Bundling**: `rollup` with `@rollup/plugin-terser` for minification
- **Testing**: `node --test` — Node's built-in test runner
- **Git hooks**: `husky` — manages pre-commit hooks

### 3.2 Style

- Tabs for indentation. No spaces.
- Double quotes for strings.
- No semicolons (automatic insertion applies, but don't rely on them).
- All exported functions MUST have JSDoc comments.
- Private functions prefixed with `_`.
- Functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`.

```javascript
// Correct: JSDoc on exported functions
/**
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {Object} [options={}] - Coercion options
 * @returns {*} The coerced value
 */
export function coerce(arg, options = {}) {
	const { maxStringSize = 100000 } = options;

	if (typeof arg !== "string") {
		return arg;
	}

	const value = arg.trim();

	if (new TextEncoder().encode(value).length > maxStringSize) {
		throw new Error(`String exceeds maximum size of ${maxStringSize} bytes`);
	}

	return value;
}
```

### 3.3 Error Handling

- Throw typed errors with descriptive messages. Use `new Error()`.
- Catch at the boundary, not inside logic.
- Never swallow errors silently — always log or re-throw.

```javascript
// Wrong: Swallowing errors silently
try {
	JSON.parse(value);
} catch {
	// Not valid JSON
}

// Right: Catch at the boundary
function parseInput(input) {
	try {
		return JSON.parse(input);
	} catch (err) {
		throw new Error(`Failed to parse input: ${err.message}`);
	}
}
```

### 3.4 Async

- Use `async` / `await` consistently for I/O-bound operations.
- All async functions MUST handle rejections — either with `.catch()` or `try/catch`.

```javascript
// Correct: Proper async error handling
async function fetchData(url) {
	try {
		const response = await fetch(url);
		return response.json();
	} catch (err) {
		throw new Error(`Fetch failed: ${err.message}`);
	}
}
```

### 3.5 Testing

- Each public function or class must have at least one test.
- Use Node's built-in `node --test` runner.
- Tests live in `tests/` directory (flat structure).
- Test filenames mirror source structure with `_test` suffix:
  - `src/coerce.js` → `tests/coercion_test.js`
  - `src/helpers.js` → `tests/helpers_test.js`
- No real external services in tests.

```javascript
// Correct: Test structure
const { describe, it } = globalThis["node:test"];
const assert = require("node:assert/strict");
const { coerce } = require("../src/coerce.js");

describe("coerce()", () => {
	it("should coerce 'true' string to boolean true", () => {
		assert.strictEqual(coerce("true"), true);
	});

	it("should coerce 'null' string to null", () => {
		assert.strictEqual(coerce("null"), null);
	});

	it("should throw on oversized strings", () => {
		assert.throws(() => coerce("x".repeat(200000)), Error);
	});
});
```

---

## 4. Framework Conventions

### 4.1 ESM / Bundling

- Source is ES Modules (`"type": "module"` in `package.json`).
- Rollup bundles to both ESM (`dist/tiny-coerce.js`) and CommonJS (`dist/tiny-coerce.cjs`).
- Exports are configured with dual ESM/CommonJS entry points in `package.json`.
- TypeScript declarations are published in `types/coerce.d.ts`.

```json
{
  "type": "module",
  "exports": {
    "types": "./types/coerce.d.ts",
    "import": "./dist/tiny-coerce.js",
    "require": "./dist/tiny-coerce.cjs"
  }
}
```

### 4.2 JSDoc Conventions

- All public functions MUST have JSDoc comments with `@param`, `@returns`, and when appropriate, `@throws`.
- Private utilities may have minimal JDoc (`@private`).
- Type annotations in JSDoc: `{string}`, `{number}`, `{Object}`, `{Array}`, `{*}`, `{boolean}`.

```javascript
/**
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {boolean} [deep=false] - Whether to recursively coerce nested values
 * @param {Object} [options={}] - Coercion options
 * @param {number} [options.maxDepth=100] - Maximum recursion depth
 * @param {number} [options.maxStringSize=100000] - Maximum string size in bytes
 * @returns {*} The coerced value
 */
```

### 4.3 Module Structure

- Source modules live in `src/`.
- `coerce.js` is the entry point; it imports helpers and constants.
- `helpers.js` contains pure type-checking functions (no side effects).
- `constants.js` exports shared constants for reuse and easy configuration.
- No module should have side effects at load time.

---

## 5. Git Conventions

### 5.1 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add JSON string coercion support
fix: handle oversized string edge case
docs: update AGENTS.md with coverage info
test: add deep coercion walks for nested arrays
chore: bump version to 3.1.0
```

### 5.2 Branching

- Main branch is `main`.
- Feature branches: `feat/<short-desc>` or `fix/<short-desc>`.
- Never commit directly to `main`. Always create a feature branch first, then open a PR targeting `main`.

### 5.2.1 Agent Workflow

When auditing or modifying AGENTS.md (or any file):
1. Create a feature branch: `git checkout -b docs/<short-desc>` (or `feat/`, `fix/`).
2. Make changes and commit on the feature branch.
3. Push the feature branch and open a PR with `gh pr create --base main`.
4. Never commit or push directly to `main` or `master`.

### 5.3 Code Review

- All changes require at least one other reviewer (automated checks are mandatory but not sufficient).
- No merging without passing CI (lint → test → build).
- PR descriptions must reference related items from design documents.

### 5.4 Pull Request Templates

If a `.github/PULL_REQUEST_TEMPLATE.md` file exists, it MUST be used when creating PRs. Fill out every section — do not leave any section blank. If a section does not apply, write `N/A` rather than skipping it.

---

## 6. Operational Rules

Session learnings — critical gotchas that affect how code must be written and tested.

### 6.1 Coverage

The project enforces **100% code coverage**. Every new function or class needs test coverage. No exceptions.

```bash
npm run coverage          # Run tests and generate coverage.txt
cat coverage.txt          # View file-level coverage report
```

```
ℹ start of coverage report
ℹ ----------------------------------------------------------
ℹ file      | line % | branch % | funcs % | uncovered lines
ℹ ----------------------------------------------------------
ℹ src/coerce.js  | 100.00 |   100.00 |  100.00 | 
ℹ src/helpers.js | 100.00 |   100.00 |  100.00 | 
ℹ ----------------------------------------------------------
ℹ all files      | 100.00 |   100.00 |  100.00 | 
ℹ ----------------------------------------------------------
ℹ end of coverage report
```

### 6.2 Coverage Report File

The `npm run coverage` script writes the formatted coverage report to `coverage.txt`. Always keep this file up to date after adding or modifying code.

### 6.3 Lint Before Build

The `build` script runs `npm run lint` before bundling. If linting fails, the build is aborted. Fix linting errors first:

```bash
npm run fix    # Auto-fix what can be fixed
npm run lint   # Verify no remaining issues
```

### 6.4 Testing with Node --test

Node's built-in test runner requires `node --test` syntax. Tests use `node:assert/strict` for assertions. There is no mocking library — use pure logic and stub functions directly.

```javascript
// Correct: Stub pattern without a mocking library
const originalFetch = globalThis.fetch;

globalThis.fetch = () => Promise.resolve({ json: () => Promise.resolve({}) });
// ... assertions ...
globalThis.fetch = originalFetch;  // Restore
```

### 6.5 TextEncoder for Byte Size

The project uses `new TextEncoder().encode(value).length` for byte-size checking of strings. Do not use `value.length` — that counts code points, not bytes.

```javascript
// Correct: Byte size check
if (new TextEncoder().encode(value).length > maxStringSize) {
	throw new Error(`String exceeds maximum size`);
}

// Wrong: Code point count, not bytes
if (value.length > maxStringSize) {
	// This is incorrect for non-ASCII strings!
}
```

### 6.6 Unreachable Code

Code that can never execute is a smell. Remove dead code to avoid coverage gaps and confusion.

---

## 7. Session Learnings

Discovery notes about the codebase.

### 7.1 README is the source of truth for project layout

The `README.md` may show a more up-to-date project structure (e.g., additional modules, tool files). When in doubt, use it to verify the layout in section 2.0.

### 7.2 Coercion Pipeline

The coercion pipeline in `coerce.js` follows a defined order:
1. Non-string input → walk if `deep`, return as-is otherwise
2. Check size limit against `maxStringSize`
3. Trim whitespace
4. Check for typed strings: `true`, `false`, `null`, `undefined` (exact match)
5. Try numeric coercion via `Number()`
6. Try `JSON.parse()` for objects, arrays, or quoted strings
7. Return trimmed original string as fallback

### 7.3 Deep Coercion

Deep coercion recursively walks objects and arrays, applying the same coercion to each leaf value. The `walk()` function respects `maxDepth` and throws if exceeded.

---

## 8. Checklist Before Marking a TODO Complete

- [ ] JSDoc on all public APIs with `@param`, `@returns`, and `@throws` where relevant.
- [ ] Unit tests written and passing with `npm test`.
- [ ] 100% code coverage maintained (use `npm run coverage` to enforce this).
- [ ] `oxlint` and `oxfmt` pass with no errors (`npm run lint`).
- [ ] `npm run build` succeeds (lint + rollup).
- [ ] No hardcoded secrets or credentials used.
- [ ] Environment variables sourced, not hardcoded.
- [ ] No semicolons used (consistent with project style).
- [ ] Tabs used for indentation (not spaces).
- [ ] Double quotes used for strings.
- [ ] Threat model considerations addressed in PR description.
