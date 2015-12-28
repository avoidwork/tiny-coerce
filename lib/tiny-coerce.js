"use strict";

/**
 * Tiny coercion library for Client or Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2015
 * @license BSD-3-Clause
 * @link http://avoidwork.github.io/tiny-coerce
 * @version 1.0.1
 */
(function (global) {

	var jsonWrap = /^[\[\{]/;

	function coerce(value) {
		var result = undefined,
		    tmp = undefined;

		if (value === null || value === undefined) {
			result = undefined;
		} else if (value === "true") {
			result = true;
		} else if (value === "false") {
			result = false;
		} else if (value === "null") {
			result = null;
		} else if (value === "undefined") {
			result = undefined;
		} else if (value === "") {
			result = value;
		} else if (!isNaN(tmp = Number(value))) {
			result = tmp;
		} else if (jsonWrap.test(value)) {
			try {
				result = JSON.parse(value);
			} catch (e) {
				console.warn(e);
				result = value;
			}
		} else {
			result = value;
		}

		return result;
	}

	coerce.version = "1.0.1";

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = coerce;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return coerce;
		});
	} else {
		global.coerce = coerce;
	}
})(typeof window !== "undefined" ? window : global);
