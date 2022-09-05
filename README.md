# Tiny Coerce

String to primitive coercion for Client or Server. It's great for DOM data attributes, localStorage,
and other cases where your need to store a String.

## API
##### coerce (arg[, deep = false])
Returns a coercion of `arg`. Deep coercion is optional with the second parameter.

First parameter is trimmed before coercion!

## Example
```javascript
import {coerce} from "tiny-coerce";

console.log(coerce("true")); // true
console.log(coerce("null")); // null
console.log(coerce({a: {b: "50"}}, true).a.b) // 50
```

## How can I load dom-router?
When loaded with a script tag, `window.tinyCoerce.coerce()` will be created.

## License
Copyright (c) 2022 Jason Mulligan
Licensed under the BSD-3 license
