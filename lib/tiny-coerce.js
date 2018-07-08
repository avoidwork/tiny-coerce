/**
 * Tiny coercion library for Client or Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2018
 * @license BSD-3-Clause
 * @version 1.1.0
 */
(function (global) {
	const regex = {
		false: /^(F|f)alse$/,
		null: /^(N|n)ull$/,
		json: /^[\[\{]/,
		true: /^(t|T)rue$/
	};

	let coerce, walk;

	walk = arg => {
		if (Array.isArray(arg)) {
			arg = arg.forEach((i, idx) => {
				arg[idx] = coerce(i, true);
			});
		} else if (arg instanceof Object) {
			Object.keys(arg).forEach(key => {
				arg[key] = coerce(arg[key], true);
			});
		}
	};

	coerce = (arg, deep = false) => {
		let result;

		if (typeof arg !== "string") {
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
			} else if (value === "undefined") {
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
	};

	coerce.version = "1.1.0";

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = coerce;
	} else if (typeof define === "function" && define.amd !== void 0) {
		define(() => coerce);
	} else {
		global.coerce = coerce;
	}
}(typeof window !== "undefined" ? window : global));
