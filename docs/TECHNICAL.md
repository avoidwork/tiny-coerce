# Technical Design

## Architecture

### Module Structure

```
src/
├── coerce.js      # Main coercion logic (exports `coerce`)
├── helpers.js     # Helper functions (internal use)
└── constants.js   # Constants and configuration
```

### Type Coercion Pipeline

The coercion process follows this decision tree:

```
┌─────────────────────────────────────────────────────────────┐
│                    coerce(arg, deep, options)                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  typeof arg !== "string"    │
        └───────────┬─────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────┐         ┌─────────────────────┐
    │ Return  │         │  arg.trim()         │
    │ as-is   │         │  value = trimmed    │
    └─────────┘         └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
            ┌─────────────┐              ┌─────────────────┐
            │ maxSize >   │              │ value.length    │
            │ limit?      │              │ === 0?          │
            └──────┬──────┘              └────────┬────────┘
                   │                              │
            ┌──────┴──────┐                      │
            │             │                      ▼
            ▼             ▼              ┌──────────────┐
        Throw Error   Continue      Return "" (empty)
```

### Coercion Order

For non-empty strings, coercion attempts occur in this order:

1. **Boolean true**: `isTrue(value)` → `"true"` (case-insensitive)
2. **Boolean false**: `isFalse(value)` → `"false"` (case-insensitive)
3. **Null**: `isNull(value)` → `"null"` (case-insensitive)
4. **Undefined**: `isUndefined(value)` → `"undefined"` (exact match)
5. **Number**: `Number(value)` → any numeric string
6. **JSON**: `JSON.parse(value)` → objects, arrays, or strings
7. **Fallback**: Return original trimmed string

### Deep Coercion

When `deep = true`, the `walk()` function recursively processes nested structures:

```javascript
function walk(arg, options, coerceFn, depth) {
    // Check recursion depth limit
    if (depth > maxDepth) throw Error();
    
    // Create new structure (no mutation)
    const result = Array.isArray(arg) ? [] : {};
    
    // Recursively coerce each value
    for each key in arg:
        result[key] = coerceFn(arg[key], true, options, depth + 1);
    
    return result;
}
```

### Security Considerations

1. **String Size Limit**: Prevents DoS from massive inputs (default: 100KB)
2. **Recursion Depth Limit**: Prevents stack overflow from deeply nested structures (default: 100)
3. **No Prototype Pollution**: Uses `Object.keys()` and bracket notation, avoiding `__proto__`
4. **JSON Safety**: `JSON.parse()` is safe from prototype pollution (creates plain objects)

### Performance Characteristics

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Simple coercion | O(1) | String comparisons and Number() |
| JSON parsing | O(n) | n = string length |
| Deep coercion | O(n × d) | n = total values, d = depth |

### Design Decisions

1. **Immutable by default**: `walk()` creates new structures instead of mutating input
2. **Case-insensitive primitives**: `TRUE`, `True`, `true` all coerce to `true`
3. **JSON strings supported**: `'"hello"'` coerces to `"hello"` (not `'"hello"'`)
4. **No regex for primitives**: Uses `toLowerCase()` string comparison for better performance
5. **Single responsibility**: `coerce()` handles all logic; `walk()` only traverses
