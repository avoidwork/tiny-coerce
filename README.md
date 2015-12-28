# tiny-coerce
[![build status](https://secure.travis-ci.org/avoidwork/tiny-coerce.svg)](http://travis-ci.org/avoidwork/tiny-coerce)

Tiny library for String to primitive coercion for Client or Server. It's great for DOM data attributes, and other cases where your need to store a String.

## Example
```javascript
const coerce = require("tiny-coerce");
console.log(coerce("true")); // true
console.log(coerce("null")); // null
```

## License
Copyright (c) 2015 Jason Mulligan
Licensed under the BSD-3 license
