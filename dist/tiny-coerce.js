/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
const STRING = "string";
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
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {Object} [options={}] - Coercion options
 * @param {number} [options.maxStringSize=100000] - Maximum string size in bytes
 * @returns {*} The coerced value
 */
function coerce(arg, options = {}) {
	const { maxStringSize = MAX_STRING_SIZE } = options;

	if (typeof arg !== STRING) {
		return arg;
	}

	const value = arg.trim();

	if (value.length > maxStringSize) {
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
			return parsed;
		}
	} catch {
		// Not valid JSON
	}

	return value;
}export{coerce};