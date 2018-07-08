const path = require("path"),
	coerce = require(path.join(__dirname, "..", "lib", "tiny-coerce.js"));

exports.flat = {
	setUp: function (done) {
		this.number = "1234";
		this.boolean = "true";
		this.json = "{\"test\": true}";
		this.undefined = "undefined";
		this.null = "null";
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(coerce(this.number), 1234, "Should be `1234`");
		test.equal(coerce(this.boolean), true, "Should be `true`");
		test.equal(coerce(this.json) instanceof Object, true, "Should be an Object");
		test.equal(coerce(this.undefined), undefined, "Should be `undefined`");
		test.equal(coerce(this.null), null, "Should be `null`");
		test.done();
	}
};

exports.deep = {
	setUp: function (done) {
		done();
	},
	test: function (test) {
		test.expect(2);
		test.equal(coerce({a: {b: "50"}}, true).a.b, 50, "Should be `50`");
		test.equal(coerce("{\"a\": {\"b\": \"50\"}}", true).a.b, 50, "Should be `50`");
		test.done();
	}
};
