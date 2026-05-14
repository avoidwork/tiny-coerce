import {default as assert} from "node:assert";
import {test, describe, beforeEach} from "node:test";
import {coerce} from "../src/coerce.js";

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

	test("It should coerce JSON string", () => {
		assert.strictEqual(coerce(JSON.stringify(object), true).a.b, 50, "Should be `50`");
	});

	test("It should coerce object", () => {
		assert.strictEqual(coerce(object, true).a.b, 50, "Should be `50`");
	});

	test("It should coerce array", () => {
		const arr = ["1", "2", "3"];
		const result = coerce(arr, true);
		assert.strictEqual(result[0], 1);
		assert.strictEqual(result[1], 2);
		assert.strictEqual(result[2], 3);
	});

	test("It should coerce nested array in object", () => {
		const obj = {items: ["10", "20"]};
		const result = coerce(obj, true);
		assert.strictEqual(result.items[0], 10);
		assert.strictEqual(result.items[1], 20);
	});
});

describe("Testing BigInt coercion", () => {
	test("should coerce '123n' to BigInt(123)", () => {
		assert.strictEqual(coerce("123n"), BigInt(123));
	});

	test("should coerce '-456n' to BigInt(-456)", () => {
		assert.strictEqual(coerce("-456n"), BigInt(-456));
	});

	test("should coerce '0n' to BigInt(0)", () => {
		assert.strictEqual(coerce("0n"), BigInt(0));
	});

	test("should coerce '9007199254740991n' to BigInt", () => {
		assert.strictEqual(coerce("9007199254740991n"), BigInt(9007199254740991));
	});

	test("should coerce BigInt in deep mode", () => {
		const obj = { big: "12345n" };
		assert.strictEqual(coerce(obj, true).big, BigInt(12345));
	});

	test("should coerce BigInt in array in deep mode", () => {
		const arr = ["1n", "2n", "3n"];
		const result = coerce(arr, true);
		assert.strictEqual(result[0], BigInt(1));
		assert.strictEqual(result[1], BigInt(2));
		assert.strictEqual(result[2], BigInt(3));
	});

	test("should fall through to number coercion for invalid BigInt string", () => {
		assert.strictEqual(coerce("123nn"), "123nn");
	});

	test("should fall through for 'nn' which is BigInt-matching but invalid", () => {
		assert.strictEqual(coerce("nn"), "nn");
	});

	test("should re-throw non-SyntaxError from JSON.parse", () => {
		const originalJSONParse = globalThis.JSON.parse;
		globalThis.JSON.parse = () => {
			throw new TypeError("not a syntax error");
		};
		try {
			assert.throws(() => coerce("not json"), (err) => err instanceof TypeError);
		} finally {
			globalThis.JSON.parse = originalJSONParse;
		}
	});
});

describe("Testing non-string fallback", () => {
	test("should return non-string as-is when deep is false", () => {
		assert.strictEqual(coerce(123), 123);
		assert.strictEqual(coerce(true), true);
		assert.strictEqual(coerce(false), false);
		assert.strictEqual(coerce(null), null);
		assert.strictEqual(coerce(undefined), undefined);
		const obj = {x: 1};
		assert.strictEqual(coerce(obj), obj);
		const arr = [1, 2];
		assert.strictEqual(coerce(arr), arr);
	});

	test("should return string as-is for fallback case", () => {
		assert.strictEqual(coerce("hello"), "hello");
		assert.strictEqual(coerce("world!!!"), "world!!!");
	});
});

describe("Testing options", () => {
	test("Should enforce maxStringSize", () => {
		const longString = "a".repeat(100001);
		assert.throws(() => coerce(longString, false, {maxStringSize: 100000}), /exceeds maximum size/);
	});

	test("Should enforce maxDepth", () => {
		const nested = {a: {b: {c: {d: {e: "1"}}}}};
		assert.throws(() => coerce(nested, true, {maxDepth: 3}), /exceeded/);
	});
});
