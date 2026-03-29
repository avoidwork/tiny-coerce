# API Reference

## `coerce(arg, deep = false, options = {})`

Coerces a string value to its appropriate JavaScript type.

### Parameters

- `arg` {*} - The value to coerce
- `deep` {boolean} (default: `false`) - Whether to recursively coerce nested values in arrays/objects
- `options` {Object} (default: `{}`) - Coercion options
  - `maxDepth` {number} (default: `100`) - Maximum recursion depth for deep coercion
  - `maxStringSize` {number} (default: `100000`) - Maximum string size in bytes

### Returns

{*} - The coerced value

### Coerced Types

The function automatically coerces strings to:

- **Boolean**: `"true"` → `true`, `"false"` → `false` (case-insensitive)
- **Null**: `"null"` → `null` (case-insensitive)
- **Undefined**: `"undefined"` → `undefined`
- **Number**: `"123"` → `123`, `"3.14"` → `3.14`
- **JSON Objects/Arrays**: `'{"a":1}'` → `{a: 1}`, `"[1,2]"` → `[1, 2]`
- **JSON Strings**: `'"hello"'` → `"hello"`

### Examples

```javascript
import { coerce } from "tiny-coerce";

// Basic coercion
coerce("true");        // true
coerce("false");       // false
coerce("null");        // null
coerce("undefined");   // undefined
coerce("123");         // 123
coerce("3.14");        // 3.14

// JSON coercion
coerce('{"a":1}');     // {a: 1}
coerce("[1,2,3]");     // [1, 2, 3]
coerce('"hello"');     // "hello"

// Deep coercion
coerce({a: "123"}, true);  // {a: 123}
coerce(["1", "2"], true);  // [1, 2]

// With options
coerce("true", false, {maxStringSize: 1000});
```

### Errors

Throws an `Error` if the string exceeds `maxStringSize`.
