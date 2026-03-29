/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.lru={}));})(this,(function(exports){'use strict';const STRING = "string";

const MAX_DEPTH = 100;
const MAX_STRING_SIZE = 100000;/**
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
 * @param {number} [options.maxStringSize=100000] - Maximum string size in bytes
 * @returns {*} The coerced value
 */
function coerce(arg, deep = false, options = {}, depth = 0) {
	let result;

	if (typeof arg !== STRING) {
		result = arg;

		if (deep) {
			result = walk(result, options, coerce, depth);
		}
	} else {
		const value = arg.trim();

		if (value.length > options.maxStringSize || value.length > MAX_STRING_SIZE) {
			throw new Error(
				`String exceeds maximum size of ${options.maxStringSize || MAX_STRING_SIZE} bytes`,
			);
		}

		if (value.length === 0) {
			result = value;
		} else if (isTrue(value)) {
			result = true;
		} else if (isFalse(value)) {
			result = false;
		} else if (isNull(value)) {
			result = null;
		} else if (isUndefined(value)) {
			result = undefined;
		} else {
			const num = Number(value);
			if (!isNaN(num)) {
				result = num;
			} else {
				try {
					const parsed = JSON.parse(value);
					if (isObjectOrArray(parsed) || isString(parsed)) {
						result = deep ? walk(parsed, options, coerce, depth) : parsed;
					} else {
						result = value;
					}
				} catch {
					result = value;
				}
			}
		}
	}

	return result;
}exports.coerce=coerce;}));