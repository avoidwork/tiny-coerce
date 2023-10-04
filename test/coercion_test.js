import {default as assert} from "node:assert";
import {coerce} from "../dist/tiny-coerce.cjs";

describe("Testing flat structure", function () {
	beforeEach(function () {
		this.number = "1234";
		this.boolean = "true";
		this.booleanFalse = "false";
		this.json = "{\"test\": true}";
		this.jsonString = "\"Hello World!\"";
		this.jsonStringInvalid = "{\"msg\":\"Hello World!\"";
		this.undefined = "undefined";
		this.null = "null";
		this.empty = "";
		this.quoteNewLines = "\"\n\n\n\n";
		this.quoteNumbers = "\"1234";
	});

	it("It should coerce primitives", function () {
		assert.strictEqual(coerce(this.number), 1234, "Should be `1234`");
		assert.strictEqual(coerce(this.boolean), true, "Should be `true`");
		assert.strictEqual(coerce(this.booleanFalse), false, "Should be `false`");
		assert.strictEqual(coerce(this.json) instanceof Object, true, "Should be an Object");
		assert.strictEqual(coerce(this.jsonString), "Hello World!", "Should be `Hello World!`");
		assert.strictEqual(coerce(this.jsonStringInvalid), this.jsonStringInvalid, `Should be '${this.jsonStringInvalid}`);
		assert.strictEqual(coerce(this.undefined), undefined, "Should be `undefined`");
		assert.strictEqual(coerce(this.null), null, "Should be `null`");
		assert.strictEqual(typeof coerce(this.empty), "string", "Should be `string`");
	});

	it("It should coerce invalid primitives", function () {
		assert.strictEqual(coerce(this.quoteNewLines), this.quoteNewLines.trim(), `Should be '${this.quoteNewLines.trim()}`);
		assert.strictEqual(coerce(this.quoteNumbers), this.quoteNumbers.trim(), `Should be '${this.quoteNumbers.trim()}`);
		assert.strictEqual(coerce(this.jsonStringInvalid), this.jsonStringInvalid.trim(), `Should be '${this.jsonStringInvalid.trim()}`);
	});
});

describe("Testing deep structure coercion", function () {
	beforeEach(function () {
		this.object = {a: {b: "50"}};
	});

	it("It should coerce", function () {
		assert.strictEqual(coerce(JSON.stringify(this.object), true).a.b, 50, "Should be `50`");
		assert.strictEqual(coerce(this.object, true).a.b, 50, "Should be `50`");
	});
});

