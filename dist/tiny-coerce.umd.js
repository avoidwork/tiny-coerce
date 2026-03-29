/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.lru={}));})(this,(function(exports){'use strict';const STRING = "string";
const UNDEFINED = "undefined";const regex = {
	true: /^(T|t)rue$/,
	false: /^(F|f)alse$/,
	null: /^(N|n)ull$/,
};

/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 * @param {Object} options - Coercion options
 * @param {number} [depth=0] - Current recursion depth
 * @returns {Array|Object} New structure with coerced values
 */
function walk(arg, options, depth = 0) {
	const { maxDepth = 100 } = options;

	if (depth > maxDepth) {
		throw new Error(`Maximum recursion depth of ${maxDepth} exceeded`);
	}

	const array = Array.isArray(arg);
	const x = array ? arg : Object.keys(arg);
	const result = array ? [] : {};

	const fn = (i, idx) => {
		const key = array ? idx : i;
		result[key] = coerce(array ? i : arg[i], true, options, depth + 1);
	};

	x.forEach(fn);
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
		maxStringSize = 10000,
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
			result = walk(result, options, depth);
		}
	} else {
		if (arg.length > maxStringSize) {
			throw new Error(`String exceeds maximum size of ${maxStringSize} bytes`);
		}

		const value = arg.trim();
		let tmp;

		if (value.length === 0) {
			result = value;
		} else if (coerceBoolean && regex.true.test(value)) {
			result = true;
		} else if (coerceBoolean && regex.false.test(value)) {
			result = false;
		} else if (coerceNull && regex.null.test(value)) {
			result = null;
		} else if (coerceUndefined && value === UNDEFINED) {
			result = undefined;
		} else if (coerceNumber && !isNaN((tmp = Number(value)))) {
			result = tmp;
		} else if (coerceObject) {
			let valid;

			try {
				result = JSON.parse(value);
				valid = true;
			} catch {
				result = value;
				valid = false;
			}

			if (valid && deep) {
				result = walk(result, options, depth);
			}
		} else {
			result = value;
		}
	}

	return result;
}exports.coerce=coerce;}));