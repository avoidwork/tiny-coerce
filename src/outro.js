	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = coerce;
	} else if (typeof define === "function" && define.amd !== void 0) {
		define(() => coerce);
	} else {
		global.coerce = coerce;
	}
}(typeof window !== "undefined" ? window : global));
