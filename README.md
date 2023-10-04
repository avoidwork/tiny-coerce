# Tiny Coerce

String to primitive coercion for Client or Server. It's great for DOM data attributes, localStorage,
and other cases where your need to store a String.

## Using the function

```javascript
import {coerce} from "tiny-coerce";

console.log(coerce("true")); // true
console.log(coerce("null")); // null
console.log(coerce({a: {b: "50"}}, true).a.b) // 50
```

## Testing

Tiny Coerce has 100% code coverage with its tests.

```console
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files        |     100 |     86.2 |     100 |     100 |                  
 tiny-coerce.cjs |     100 |     86.2 |     100 |     100 | 22-24,36         
-----------------|---------|----------|---------|---------|-------------------
```

## API

##### coerce (arg[, deep = false])
Returns a coercion of `arg`. Deep coercion is optional with the second parameter.

First parameter is trimmed before coercion!

## License
Copyright (c) 2023 Jason Mulligan
Licensed under the BSD-3 license
