// Node, AMD & window supported
if (typeof exports !== "undefined") {
	module.exports = coerce;
} else if (typeof define === "function" && define.amd) {
	define(function () {
		return coerce;
	});
} else {
	global.coerce = coerce;
}}(typeof window !== "undefined" ? window : global));
