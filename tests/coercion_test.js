import {default as assert} from "node:assert";
import {test, describe, beforeEach} from "node:test";
import {coerce} from "../dist/tiny-coerce.cjs";

describe("Testing flat structure", () => {
	let number, boolean, booleanFalse, json, jsonString, jsonStringInvalid, undef, nullVal, empty, quoteNewLines, quoteNumbers;

	beforeEach(() => {
		number = "1234";
		boolean = "true";
		booleanFalse = "false";
		json = '{"test": true}';
		jsonString = '"Hello World!"';
		jsonStringInvalid = '{"msg":"Hello World!"';
		undef = "undefined";
		nullVal = "null";
		empty = "";
		quoteNewLines = '"\n\n\n\n';
		quoteNumbers = '"1234';
	});

	test("It should coerce primitives", () => {
		assert.strictEqual(coerce(number), 1234, "Should be `1234`");
		assert.strictEqual(coerce(boolean), true, "Should be `true`");
		assert.strictEqual(coerce(booleanFalse), false, "Should be `false`");
		assert.strictEqual(coerce(json) instanceof Object, true, "Should be an Object");
		assert.strictEqual(coerce(jsonString), "Hello World!", "Should be `Hello World!`");
		assert.strictEqual(coerce(jsonStringInvalid), jsonStringInvalid, `Should be '${jsonStringInvalid}`);
		assert.strictEqual(coerce(undef), undefined, "Should be `undefined`");
		assert.strictEqual(coerce(nullVal), null, "Should be `null`");
		assert.strictEqual(typeof coerce(empty), "string", "Should be `string`");
	});

	test("It should coerce invalid primitives", () => {
		assert.strictEqual(coerce(quoteNewLines), quoteNewLines.trim(), `Should be '${quoteNewLines.trim()}`);
		assert.strictEqual(coerce(quoteNumbers), quoteNumbers.trim(), `Should be '${quoteNumbers.trim()}`);
		assert.strictEqual(coerce(jsonStringInvalid), jsonStringInvalid.trim(), `Should be '${jsonStringInvalid.trim()}`);
	});

	test("It should handle case-insensitive booleans", () => {
		assert.strictEqual(coerce("TRUE"), true);
		assert.strictEqual(coerce("True"), true);
		assert.strictEqual(coerce("FALSE"), false);
		assert.strictEqual(coerce("False"), false);
	});

	test("It should handle case-insensitive null", () => {
		assert.strictEqual(coerce("NULL"), null);
		assert.strictEqual(coerce("Null"), null);
	});
});

describe("Testing deep structure coercion", () => {
	let object;

	beforeEach(() => {
		object = {a: {b: "50"}};
	});

	test("It should coerce", () => {
		assert.strictEqual(coerce(JSON.stringify(object), true).a.b, 50, "Should be `50`");
		assert.strictEqual(coerce(object, true).a.b, 50, "Should be `50`");
	});
});

describe("Testing options", () => {
	test("Should respect coerceBoolean option", () => {
		assert.strictEqual(coerce("true", false, {coerceBoolean: false}), "true", "Should not coerce when disabled");
		assert.strictEqual(coerce("true", false, {coerceBoolean: true}), true, "Should coerce when enabled");
	});

	test("Should respect coerceNull option", () => {
		assert.strictEqual(coerce("null", false, {coerceNull: false}), "null", "Should not coerce when disabled");
		assert.strictEqual(coerce("null", false, {coerceNull: true}), null, "Should coerce when enabled");
	});

	test("Should respect coerceUndefined option", () => {
		assert.strictEqual(coerce("undefined", false, {coerceUndefined: false}), "undefined", "Should not coerce when disabled");
		assert.strictEqual(coerce("undefined", false, {coerceUndefined: true}), undefined, "Should coerce when enabled");
	});

	test("Should respect coerceNumber option", () => {
		assert.strictEqual(coerce("123", false, {coerceNumber: false}), "123", "Should not coerce when disabled");
		assert.strictEqual(coerce("123", false, {coerceNumber: true}), 123, "Should coerce when enabled");
	});

	test("Should respect coerceObject option", () => {
		assert.strictEqual(coerce('{"a":1}', false, {coerceObject: false}), '{"a":1}', "Should not coerce when disabled");
		assert.strictEqual(coerce('{"a":1}', false, {coerceObject: true}).a, 1, "Should coerce when enabled");
	});

	test("Should enforce maxStringSize", () => {
		const longString = "a".repeat(10001);
		assert.throws(() => coerce(longString, false, {maxStringSize: 10000}), /exceeds maximum size/);
	});
});
