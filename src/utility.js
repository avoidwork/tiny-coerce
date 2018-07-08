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

	coerce.version = "{{VERSION}}";
