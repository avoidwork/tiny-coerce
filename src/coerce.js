import { MAX_DEPTH, MAX_STRING_SIZE, STRING } from "./constants.js";
import {
	isBigInt,
	isFalse,
	isNull,
	isObjectOrArray,
	isString,
	isTrue,
	isUndefined,
} from "./helpers.js";

/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 * @param {Object} options - Coercion options
 * @param {number} depth - Current recursion depth
 * @returns {Array|Object} New structure with coerced values
 */
function _walk(arg, options, depth) {
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
 * @throws {Error} If max depth is exceeded or string exceeds max size
 */
export function coerce(arg, deep = false, options = {}, depth = 0) {
	const { maxStringSize = MAX_STRING_SIZE } = options;

	if (typeof arg !== STRING) {
		if (deep) {
			return _walk(arg, options, depth);
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

	if (isBigInt(value)) {
		try {
			return BigInt(value.slice(0, -1));
		} catch {
			// Fall through to regular number coercion
		}
	}

	const num = Number(value);
	if (!isNaN(num)) {
		return num;
	}

	try {
		const parsed = JSON.parse(value);
		if (isObjectOrArray(parsed) || isString(parsed)) {
			if (deep) {
				return _walk(parsed, options, depth);
			}
			return parsed;
		}
	} catch (e) {
		if (e instanceof SyntaxError) {
			return value;
		}
		throw e;
	}
}
