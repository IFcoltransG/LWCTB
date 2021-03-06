const fs = require("fs");
const assert = require("assert").strict;
const parser = require("../../build/grammar.js");
const symbolify = require("../../build/symbolify.js");

let files = ["basic"];
for(let file of files) {
	let code = fs.readFileSync(__dirname + "/" + file + ".lb", "utf-8");
	let tree = symbolify({
		fileName: "<test input: " + file + ".lb>",
		verbosity: 999
	}, parser.parse(code));
	let expectedTree = null;
	try {
		expectedTree = require("./" + file + ".js");
	} catch(e) {
		console.warn(`[WARN] No .js file corresponding to test file \`${file}.lb\`. Passing the test and creating a JSON file from the parse result.`);
		fs.writeFileSync(__dirname + "/" + file + ".js", "/* WARNING: autogenerated */ module.exports = " + JSON.stringify(tree, null, "\t"));
	}
	if(expectedTree) {
		assert.deepEqual(
			tree,
			expectedTree
		);
	}
}
