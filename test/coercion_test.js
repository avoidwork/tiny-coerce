import {default as assert} from "node:assert";
import {coerce} from "../dist/tiny-coerce.esm.js";

describe("Testing flat structure", function () {
	beforeEach(function () {
		this.number = "1234";
		this.boolean = "true";
		this.json = "{\"test\": true}";
		this.jsonString = "\"Hello World!\"";
		this.undefined = "undefined";
		this.null = "null";
	});

	it("It should coerce primitives", function () {
		assert.equal(coerce(this.number), 1234, "Should be `1234`");
		assert.equal(coerce(this.boolean), true, "Should be `true`");
		assert.equal(coerce(this.json) instanceof Object, true, "Should be an Object");
		assert.equal(coerce(this.jsonString), "Hello World!", "Should be `Hello World!`");
		assert.equal(coerce(this.undefined), undefined, "Should be `undefined`");
		assert.equal(coerce(this.null), null, "Should be `null`");
	});
});

describe("Testing deep structure coercion", function () {
	it("It should coerce", function () {
		assert.equal(coerce({a: {b: "50"}}, true).a.b, 50, "Should be `50`");
		assert.equal(coerce("{\"a\": {\"b\": \"50\"}}", true).a.b, 50, "Should be `50`");
	});
});

describe("Testing invalid primitives", function () {
	beforeEach(function () {
		this.empty = "\"\n\n\n\n";
		this.string = "\"1234";
		this.object = "{z";
	});

	it("It should coerce", function () {
		assert.equal(coerce(this.empty), "\"", "Should be `\"`");
		assert.equal(coerce(this.string), "\"1234", "Should be `\"1234`");
		assert.equal(coerce(this.object), "{z", "Should be `{z`");
	});
});
