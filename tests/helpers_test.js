import {default as assert} from "node:assert";
import {test, describe} from "node:test";
import {isFalse, isNull, isObjectOrArray, isString, isTrue, isUndefined} from "../src/helpers.js";

describe("isTrue", () => {
	test("should return true for 'true'", () => {
		assert.strictEqual(isTrue("true"), true);
	});

	test("should return true for 'TRUE'", () => {
		assert.strictEqual(isTrue("TRUE"), true);
	});

	test("should return true for 'True'", () => {
		assert.strictEqual(isTrue("True"), true);
	});

	test("should return false for 'false'", () => {
		assert.strictEqual(isTrue("false"), false);
	});

	test("should return false for 'null'", () => {
		assert.strictEqual(isTrue("null"), false);
	});
});

describe("isFalse", () => {
	test("should return true for 'false'", () => {
		assert.strictEqual(isFalse("false"), true);
	});

	test("should return true for 'FALSE'", () => {
		assert.strictEqual(isFalse("FALSE"), true);
	});

	test("should return true for 'False'", () => {
		assert.strictEqual(isFalse("False"), true);
	});

	test("should return false for 'true'", () => {
		assert.strictEqual(isFalse("true"), false);
	});

	test("should return false for 'null'", () => {
		assert.strictEqual(isFalse("null"), false);
	});
});

describe("isNull", () => {
	test("should return true for 'null'", () => {
		assert.strictEqual(isNull("null"), true);
	});

	test("should return true for 'NULL'", () => {
		assert.strictEqual(isNull("NULL"), true);
	});

	test("should return true for 'Null'", () => {
		assert.strictEqual(isNull("Null"), true);
	});

	test("should return false for 'nullable'", () => {
		assert.strictEqual(isNull("nullable"), false);
	});
});

describe("isUndefined", () => {
	test("should return true for 'undefined'", () => {
		assert.strictEqual(isUndefined("undefined"), true);
	});

	test("should return false for 'Undefined'", () => {
		assert.strictEqual(isUndefined("Undefined"), false);
	});

	test("should return false for 'defined'", () => {
		assert.strictEqual(isUndefined("defined"), false);
	});
});

describe("isObjectOrArray", () => {
	test("should return true for objects", () => {
		assert.strictEqual(isObjectOrArray({}), true);
		assert.strictEqual(isObjectOrArray({a: 1}), true);
	});

	test("should return true for arrays", () => {
		assert.strictEqual(isObjectOrArray([]), true);
		assert.strictEqual(isObjectOrArray([1, 2, 3]), true);
	});

	test("should return false for null", () => {
		assert.strictEqual(isObjectOrArray(null), false);
	});

	test("should return false for primitives", () => {
		assert.strictEqual(isObjectOrArray("string"), false);
		assert.strictEqual(isObjectOrArray(123), false);
		assert.strictEqual(isObjectOrArray(true), false);
	});
});

describe("isString", () => {
	test("should return true for strings", () => {
		assert.strictEqual(isString("hello"), true);
		assert.strictEqual(isString(""), true);
	});

	test("should return false for non-strings", () => {
		assert.strictEqual(isString(123), false);
		assert.strictEqual(isString(null), false);
		assert.strictEqual(isString({}), false);
		assert.strictEqual(isString([]), false);
	});
});
