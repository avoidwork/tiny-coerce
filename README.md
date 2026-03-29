# Tiny Coerce

Tiny coercion library for Client or Server. Converts string values to their appropriate JavaScript types (boolean, null, undefined, number, object, array).

Great for DOM data attributes, localStorage, and other cases where you need to store strings that represent typed values.

## Installation

```bash
npm install tiny-coerce
```

## Usage

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

## API

### `coerce(arg, deep = false, options = {})`

Coerces a string value to its appropriate JavaScript type.

**Parameters:**

- `arg` {*} - The value to coerce
- `deep` {boolean} (default: `false`) - Whether to recursively coerce nested values in arrays/objects
- `options` {Object} (default: `{}`) - Coercion options
  - `maxDepth` {number} (default: `100`) - Maximum recursion depth for deep coercion
  - `maxStringSize` {number} (default: `100000`) - Maximum string size in bytes

**Returns:** {*} - The coerced value

**Coerced Types:**

| Input | Output | Notes |
|-------|--------|-------|
| `"true"`, `"TRUE"`, `"True"` | `true` | Case-insensitive |
| `"false"`, `"FALSE"`, `"False"` | `false` | Case-insensitive |
| `"null"`, `"NULL"`, `"Null"` | `null` | Case-insensitive |
| `"undefined"` | `undefined` | Exact match |
| `"123"`, `"3.14"` | `123`, `3.14` | Any numeric string |
| `'{"a":1}'` | `{a: 1}` | Objects and arrays |
| `'"hello"'` | `"hello"` | JSON strings |

## Testing

Tiny Coerce has 100% code coverage with its tests.

```console
$ npm run coverage

ℹ start of coverage report
ℹ ----------------------------------------------------------
ℹ file      | line % | branch % | funcs % | uncovered lines
ℹ ----------------------------------------------------------
ℹ ----------------------------------------------------------
ℹ all files | 100.00 |   100.00 |  100.00 | 
ℹ ----------------------------------------------------------
ℹ end of coverage report
```

See `coverage.txt` for the latest coverage report.

## Technical Details

See [docs/TECHNICAL.md](https://github.com/avoidwork/tiny-coerce/tree/master/docs/TECHNICAL.md) for in-depth technical documentation covering:

- Architecture and module structure
- Type coercion pipeline
- Security considerations
- Performance characteristics

## License

Copyright (c) 2026 Jason Mulligan  
Licensed under the BSD-3-Clause license
