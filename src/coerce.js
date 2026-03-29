import { MAX_STRING_SIZE, STRING } from "./constants.js";
import { isFalse, isNull, isObjectOrArray, isString, isTrue, isUndefined } from "./helpers.js";

/**
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {Object} [options={}] - Coercion options
 * @param {number} [options.maxStringSize=100000] - Maximum string size in bytes
 * @returns {*} The coerced value
 */
export function coerce(arg, options = {}) {
	const { maxStringSize = MAX_STRING_SIZE } = options;

	if (typeof arg !== STRING) {
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
			return parsed;
		}
	} catch {
		// Not valid JSON
	}

	return value;
}
