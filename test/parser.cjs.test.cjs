const { test } = require("node:test");
const assert = require("node:assert/strict");
const parseSouthAfricanId = require("../src/parser.cjs");

test("parses a valid ID number (CJS require)", () => {
  const result = parseSouthAfricanId("9202205720082");
  assert.equal(result.isValid, true);
  assert.equal(result.gender, "Male");
  assert.equal(result.citizenship, "SA Citizen");
});

test("named export matches default export (CJS require)", () => {
  assert.equal(
    parseSouthAfricanId.parseSouthAfricanId,
    parseSouthAfricanId,
  );
});
