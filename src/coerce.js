import {regex} from "./regex.js";
import {STRING, UNDEFINED} from "./constants.js";

function walk (arg) {
	const array = Array.isArray(arg),
		x = array ? arg : Object.keys(arg),
		fn = (i, idx) => {
			arg[array ? idx : i] = coerce(array ? i : arg[i], true); // eslint-disable-line no-use-before-define
		};

	x.forEach(fn);
}

export function coerce (arg, deep = false) {
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
}
