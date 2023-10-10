/**
 * tiny-coerce
 *
 * @copyright 2023 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.0.1
 */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.lru={}));})(this,(function(exports){'use strict';const regex = {
	false: /^(F|f)alse$/,
	null: /^(N|n)ull$/,
	json: /^["\[{].*[}\]"]$/,
	true: /^(T|t)rue$/
};const STRING = "string";
const UNDEFINED = "undefined";function walk (arg) {
	const array = Array.isArray(arg),
		x = array ? arg : Object.keys(arg),
		fn = (i, idx) => {
			arg[array ? idx : i] = coerce(array ? i : arg[i], true); // eslint-disable-line no-use-before-define
		};

	x.forEach(fn);
}

function coerce (arg, deep = false) {
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
		} else if (regex.true.test(value)) {
			result = true;
		} else if (regex.false.test(value)) {
			result = false;
		} else if (regex.null.test(value)) {
			result = null;
		} else if (value === UNDEFINED) {
			result = undefined;
		} else if (!isNaN(tmp = Number(value))) {
			result = tmp;
		} else if (regex.json.test(value)) {
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
}exports.coerce=coerce;}));