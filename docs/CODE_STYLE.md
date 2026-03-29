# Code Style Guide

This document describes the code style and conventions used in Tiny Coerce.

## Formatting

### Indentation
- **Tabs** for indentation (not spaces)
- **1 tab** = 1 level of indentation

### Quotes
- **Double quotes** (`"`) for all strings
- Single quotes only when escaping double quotes inside

### Semicolons
- **No semicolons** - automatic semicolon insertion (ASI) is used
- Exception: when multiple statements are on the same line

### Line Length
- Keep lines under **100 characters** when possible
- Break long lines at logical points

## Naming Conventions

### Variables and Functions
- **camelCase**: `const maxValue`, `function coerceValue()`
- **Descriptive names**: Prefer `coercedValue` over `cv`
- **Verb prefixes**: `is`, `has`, `can` for boolean functions

### Constants
- **UPPER_SNAKE_CASE**: `MAX_DEPTH`, `MAX_STRING_SIZE`
- Module-level constants only

### Files
- **lowercase with hyphens**: `coerce.js`, `constants.js`
- **No spaces or special characters**

## Code Structure

### Functions
- **Single responsibility**: Each function does one thing well
- **Small functions**: Prefer many small functions over few large ones
- **Early returns**: Return early to reduce nesting

```javascript
// Good - early return
function validate(value) {
  if (!value) {
    return false;
  }
  // continue with logic
}

// Avoid - deep nesting
function validate(value) {
  if (value) {
    // more nesting
    if (something) {
      // even more
    }
  }
}
```

### Conditionals
- **Simple conditions**: Keep boolean logic straightforward
- **No negated conditions**: Prefer `if (isValid)` over `if (!isInvalid)`

```javascript
// Good
if (coerceBoolean) {
  if (isTrue(lower)) {
    result = true;
  }
}

// Avoid
if (!(!coerceBoolean)) {
  if (!(isTrue(lower) === false)) {
    result = true;
  }
}
```

### Objects and Arrays
- **Trailing commas**: Use in multi-line declarations
- **Object shorthand**: Use when property name matches value

```javascript
// Good
const options = {
  maxDepth: 100,
  maxStringSize: 100000,
};

const { maxDepth, maxStringSize } = options;
```

## Comments and Documentation

### JSDoc Comments
All exported functions must have JSDoc comments:

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
export function coerce(arg, deep = false, options = {}) {
  // ...
}
```

### Inline Comments
- Use sparingly - code should be self-documenting
- Explain **why**, not **what**
- Use for complex algorithms or non-obvious logic

```javascript
// Good - explains why
if (depth > maxDepth) {
  // Prevent stack overflow from deeply nested structures
  throw new Error(`Maximum recursion depth of ${maxDepth} exceeded`);
}

// Avoid - obvious
const value = arg.trim(); // trim the value
```

### Private Functions
Prefix internal functions with no special notation, but document as `@private`:

```javascript
/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 * @returns {Array|Object} New structure with coerced values
 */
function walk(arg, options, coerceFn, depth = 0) {
  // ...
}
```

## Error Handling

### Throwing Errors
- **Validate inputs** early and throw descriptive errors
- Use **Error** for recoverable validation failures
- Include **context** in error messages

```javascript
if (value.length > maxStringSize) {
  throw new Error(`String exceeds maximum size of ${maxStringSize} bytes`);
}
```

### Catching Errors
- **Catch specifically**: Handle expected errors, let unexpected ones propagate
- **Don't swallow errors**: Log or rethrow in catch blocks

```javascript
// Good - handle specific case
try {
  result = JSON.parse(value);
} catch {
  result = value; // Not valid JSON, keep as string
}

// Avoid - silently ignoring
try {
  riskyOperation();
} catch (e) {
  // do nothing
}
```

## Testing

### Test Structure
- **Test file naming**: `*_test.js`
- **Describe blocks**: Group related tests
- **Test names**: Describe expected behavior

```javascript
describe("Testing flat structure", () => {
  test("It should coerce primitives", () => {
    assert.strictEqual(coerce("true"), true);
  });
});
```

### Assertions
- **Specific assertions**: Use `strictEqual` over `equal`
- **Descriptive messages**: Include context in failure messages

```javascript
// Good
assert.strictEqual(coerce("123"), 123, "Should coerce numeric string");

// Avoid
assert(coerce("123") === 123);
```

## Performance

### Optimization Guidelines
1. **Prefer built-ins**: `Number()`, `toLowerCase()` are optimized
2. **Avoid unnecessary allocations**: Reuse objects when possible
3. **Early exits**: Return early to avoid unnecessary work
4. **String comparisons**: Faster than regex for simple patterns

### What Not to Optimize
- **Readability over micro-optimizations**: Clear code is better than clever code
- **Premature optimization**: Profile before optimizing
- **Bottlenecks only**: Focus on actual performance issues

## Git Commit Style

### Commit Messages
- **Present tense**: "Add feature" not "Added feature"
- **Imperative mood**: "Fix bug" not "Fixes bug"
- **50 characters max** for subject line
- **Detailed body** if needed (wrap at 72 chars)

```
Add maxStringSize option

Add maxStringSize option to prevent DoS from large inputs.
Defaults to 100000 bytes.

Closes #123
```

### Commit Scope
- Use `--no-verify` to skip husky hooks during development
- Keep commits focused and atomic

## Review Checklist

Before submitting a PR, ensure:

- [ ] Code passes `npm run lint`
- [ ] Code passes `npm test`
- [ ] All new functions have JSDoc comments
- [ ] Tests cover new functionality
- [ ] Documentation is updated if needed
- [ ] Commit messages follow the style guide
- [ ] No console.log or debugger statements
- [ ] No secrets or credentials committed
