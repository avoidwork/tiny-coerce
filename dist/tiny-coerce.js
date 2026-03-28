/**
 * tiny-coerce
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.2
 */
const STRING = "string";
const UNDEFINED = "undefined";

const REGEX = {
	false: /^(F|f)alse$/,
	json: /^["[{].*[}\]"]$/,
	null: /^(N|n)ull$/,
	true: /^(T|t)rue$/,
};/**
 * Walks through an array or object and coerces each value
 * @private
 * @param {Array|Object} arg - The array or object to walk
 */
function walk(arg) {
	const array = Array.isArray(arg),
		x = array ? arg : Object.keys(arg),
		fn = (i, idx) => {
			arg[array ? idx : i] = coerce(array ? i : arg[i], true); // eslint-disable-line no-use-before-define
		};

	x.forEach(fn);
}

/**
 * Coerces a string value to its appropriate type
 * @param {*} arg - The value to coerce
 * @param {boolean} [deep=false] - Whether to recursively coerce nested values
 * @returns {*} The coerced value
 */
function coerce(arg, deep = false) {
	let result;

	if (typeof arg !== STRING) {
		result = arg;

		if (deep) {
			walk(result);
		}
	} else {
		const value = arg.trim();
		let tmp;

		if (value.length === 0) {
			result = value;
		} else if (REGEX.true.test(value)) {
			result = true;
		} else if (REGEX.false.test(value)) {
			result = false;
		} else if (REGEX.null.test(value)) {
			result = null;
		} else if (value === UNDEFINED) {
			result = undefined;
		} else if (!isNaN((tmp = Number(value)))) {
			result = tmp;
		} else if (REGEX.json.test(value)) {
			let valid;

			try {
				result = JSON.parse(value);
				valid = true;
			} catch (e) {
				result = value;
				valid = false;
			}

			if (valid && deep) {
				walk(result);
			}
		} else {
			result = value;
		}
	}

	return result;
}export{coerce};