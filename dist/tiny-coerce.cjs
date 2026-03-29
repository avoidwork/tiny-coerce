/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
'use strict';

const STRING = "string";
const MAX_DEPTH = 100;
const MAX_STRING_SIZE = 100000;

/**
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
}

/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 * @param {Object} options - Coercion options
 * @param {number} depth - Current recursion depth
 * @returns {Array|Object} New structure with coerced values
 */
function walk(arg, options, depth) {
	const { maxDepth = MAX_DEPTH } = options;

	if (depth > maxDepth) {
		throw new Error(`Maximum recursion depth of ${maxDepth} exceeded`);
	}

	const array = Array.isArray(arg);
	const x = array ? arg : Object.keys(arg);
	const result = array ? [] : {};

	for (let i = 0; i < x.length; i++) {
		const key = array ? i : x[i];
		result[key] = coerce(arg[key], true, options, depth + 1);
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
 * @param {number} [depth=0] - Current recursion depth (internal use)
 * @returns {*} The coerced value
 */
function coerce(arg, deep = false, options = {}, depth = 0) {
	const { maxStringSize = MAX_STRING_SIZE } = options;

	if (typeof arg !== STRING) {
		if (deep) {
			return walk(arg, options, depth);
		}
		return arg;
	}

	const value = arg.trim();

	if (new TextEncoder().encode(value).length > maxStringSize) {
		throw new Error(`String exceeds maximum size of ${maxStringSize} bytes`);
	}

	if (value.length === 0) {
		return value;
	}

	if (isTrue(value)) {
		return true;
	}

	if (isFalse(value)) {
		return false;
	}

	if (isNull(value)) {
		return null;
	}

	if (isUndefined(value)) {
		return undefined;
	}

	const num = Number(value);
	if (!isNaN(num)) {
		return num;
	}

	try {
		const parsed = JSON.parse(value);
		if (isObjectOrArray(parsed) || isString(parsed)) {
			if (deep) {
				return walk(parsed, options, depth);
			}
			return parsed;
		}
	} catch {
		// Not valid JSON
	}

	return value;
}

exports.coerce = coerce;
