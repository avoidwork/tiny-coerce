# tiny-coerce
[![build status](https://secure.travis-ci.org/avoidwork/tiny-coerce.svg)](http://travis-ci.org/avoidwork/tiny-coerce)

String to primitive coercion for Client or Server. It's great for DOM data attributes, localStorage,
and other cases where your need to store a String.

## API
##### coerce (arg[, deep = false])
Returns a coercion of `arg`. Deep coercion is optional with the second parameter.

First parameter is trimmed before coercion!

## Example
```javascript
const coerce = require("tiny-coerce");

console.log(coerce("true")); // true
console.log(coerce("null")); // null
console.log(coerce({a: {b: "50"}}, true).a.b) // 50
```

## License
Copyright (c) 2018 Jason Mulligan
Licensed under the BSD-3 license
