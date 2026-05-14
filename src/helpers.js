/**
 * Checks if value is a boolean true
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
export function isTrue(value) {
	return value.toLowerCase() === "true";
}

/**
 * Checks if value is a boolean false
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
export function isFalse(value) {
	return value.toLowerCase() === "false";
}

/**
 * Checks if value is null
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
export function isNull(value) {
	return value.toLowerCase() === "null";
}

/**
 * Checks if value is undefined
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
export function isUndefined(value) {
	return value === "undefined";
}

/**
 * Checks if parsed JSON is an object or array (not a primitive)
 * @private
 * @param {*} value - The parsed value
 * @returns {boolean}
 */
export function isObjectOrArray(value) {
	return typeof value === "object" && value !== null;
}

/**
 * Checks if parsed JSON is a string
 * @private
 * @param {*} value - The parsed value
 * @returns {boolean}
 */
export function isString(value) {
	return typeof value === "string";
}

/**
 * Checks if string looks like a BigInt literal (e.g., "123n")
 * @private
 * @param {string} value - The trimmed string value
 * @returns {boolean}
 */
export function isBigInt(value) {
	return typeof value === "string" && value[value.length - 1] === "n" && value.length > 1;
}
