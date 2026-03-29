/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
const STRING = "string";

const MAX_DEPTH = 100;
const MAX_STRING_SIZE = 10000;/**
 * Checks if value is a boolean true
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
function isTrue(value) {
	return value.toLowerCase() === "true";
}

/**
 * Checks if value is a boolean false
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
function isFalse(value) {
	return value.toLowerCase() === "false";
}

/**
 * Checks if value is null
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
function isNull(value) {
	return value.toLowerCase() === "null";
}

/**
 * Checks if value is undefined
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
function isUndefined(value) {
	return value === "undefined";
}

/**
 * Checks if parsed JSON is an object or array (not a primitive)
 * @private
 * @param {*} value - The parsed value
 * @returns {boolean}
 */
function isObjectOrArray(value) {
	return typeof value === "object" && value !== null;
}

/**
 * Checks if parsed JSON is a string
 * @private
 * @param {*} value - The parsed value
 * @returns {boolean}
 */
function isString(value) {
	return typeof value === "string";
}/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 * @param {Object} options - Coercion options
 * @param {Function} coerceFn - The coerce function to use
 * @param {number} [depth=0] - Current recursion depth
 * @returns {Array|Object} New structure with coerced values
 */
function walk(arg, options, coerceFn, depth = 0) {
	const { maxDepth = MAX_DEPTH } = options;

	if (depth > maxDepth) {
		throw new Error(`Maximum recursion depth of ${maxDepth} exceeded`);
	}

	const array = Array.isArray(arg);
	const x = array ? arg : Object.keys(arg);
	const result = array ? [] : {};

	for (let i = 0; i < x.length; i++) {
		const key = array ? i : x[i];
		result[key] = coerceFn(arg[key], true, options, depth + 1);
	}

	return result;
}

/**
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {boolean} [deep=false] - Whether to recursively coerce nested values
 * @param {Object} [options={}] - Coercion options
 * @param {number} [options.maxDepth=100] - Maximum recursion depth
 * @param {number} [options.maxStringSize=10000] - Maximum string size in bytes
 * @param {boolean} [options.coerceBoolean=true] - Whether to coerce booleans
 * @param {boolean} [options.coerceNull=true] - Whether to coerce null
 * @param {boolean} [options.coerceUndefined=true] - Whether to coerce undefined
 * @param {boolean} [options.coerceNumber=true] - Whether to coerce numbers
 * @param {boolean} [options.coerceObject=true] - Whether to coerce objects/arrays via JSON
 * @returns {*} The coerced value
 */
function coerce(arg, deep = false, options = {}, depth = 0) {
	const {
		maxStringSize = MAX_STRING_SIZE,
		coerceBoolean = true,
		coerceNull = true,
		coerceUndefined = true,
		coerceNumber = true,
		coerceObject = true,
	} = options;

	let result;

	if (typeof arg !== STRING) {
		result = arg;

		if (deep) {
			result = walk(result, options, coerce, depth);
		}
	} else {
		const value = arg.trim();

		if (value.length > maxStringSize) {
			throw new Error(`String exceeds maximum size of ${maxStringSize} bytes`);
		}

		if (value.length === 0) {
			result = value;
		} else {
			const lower = value.toLowerCase();

			if (coerceBoolean) {
				if (isTrue(lower)) {
					result = true;
				} else if (isFalse(lower)) {
					result = false;
				} else if (coerceNull && isNull(lower)) {
					result = null;
				} else if (coerceUndefined && isUndefined(value)) {
					result = undefined;
				} else if (coerceNumber) {
					const num = Number(value);
					if (!isNaN(num)) {
						result = num;
					} else if (coerceObject) {
						try {
							const parsed = JSON.parse(value);
							if (isObjectOrArray(parsed) || isString(parsed)) {
								result = parsed;
							} else {
								result = value;
							}
						} catch {
							result = value;
						}

						if (result !== value && deep) {
							result = walk(result, options, coerce, depth);
						}
					} else {
						result = value;
					}
				} else if (coerceObject) {
					try {
						const parsed = JSON.parse(value);
						if (isObjectOrArray(parsed) || isString(parsed)) {
							result = parsed;
						} else {
							result = value;
						}
					} catch {
						result = value;
					}

					if (result !== value && deep) {
						result = walk(result, options, coerce, depth);
					}
				} else {
					result = value;
				}
			} else if (coerceNull && isNull(lower)) {
				result = null;
			} else if (coerceUndefined && isUndefined(value)) {
				result = undefined;
			} else if (coerceNumber) {
				const num = Number(value);
				if (!isNaN(num)) {
					result = num;
				} else if (coerceObject) {
					try {
						const parsed = JSON.parse(value);
						if (isObjectOrArray(parsed) || isString(parsed)) {
							result = parsed;
						} else {
							result = value;
						}
					} catch {
						result = value;
					}

					if (result !== value && deep) {
						result = walk(result, options, coerce, depth);
					}
				} else {
					result = value;
				}
			} else if (coerceObject) {
				try {
					const parsed = JSON.parse(value);
					if (isObjectOrArray(parsed) || isString(parsed)) {
						result = parsed;
					} else {
						result = value;
					}
				} catch {
					result = value;
				}

				if (result !== value && deep) {
					result = walk(result, options, coerce, depth);
				}
			} else {
				result = value;
			}
		}
	}

	return result;
}export{coerce};