import { MAX_DEPTH, MAX_STRING_SIZE, STRING } from "./constants.js";
import { isFalse, isNull, isObjectOrArray, isString, isTrue, isUndefined } from "./helpers.js";

/**
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
export function coerce(arg, deep = false, options = {}, depth = 0) {
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
}
