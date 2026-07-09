import { test } from "node:test";
import assert from "node:assert/strict";
import parseSouthAfricanId from "../src/parser.mjs";

test("parses a valid ID number (ESM import)", () => {
  const result = parseSouthAfricanId("9202205720082");
  assert.equal(result.isValid, true);
  assert.equal(result.isValidChecksum, true);
  assert.equal(result.gender, "Male");
  assert.equal(result.citizenship, "SA Citizen");
  assert.equal(result.dateOfBirth.getUTCFullYear(), 1992);
  assert.equal(result.dateOfBirth.getUTCMonth(), 1);
  assert.equal(result.dateOfBirth.getUTCDate(), 20);
});

test("rejects a number that isn't 13 digits", () => {
  const result = parseSouthAfricanId("12345");
  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, ["ID number must be exactly 13 digits"]);
});

test("flags an invalid month and day", () => {
  const result = parseSouthAfricanId("9213324720089");
  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes("Invalid month in date of birth"));
  assert.ok(result.errors.includes("Invalid day in date of birth"));
});

test("flags an invalid checksum digit", () => {
  const result = parseSouthAfricanId("9202205720083");
  assert.equal(result.isValidChecksum, false);
  assert.ok(result.errors.includes("Checksum digit is invalid"));
});

test("classifies gender from the gender digits", () => {
  const female = parseSouthAfricanId("9202200720087");
  assert.equal(female.gender, "Female");
});

test("classifies permanent residents and unknown citizenship digits", () => {
  const resident = parseSouthAfricanId("9202205720181");
  assert.equal(resident.citizenship, "Permanent Resident");

  const unknown = parseSouthAfricanId("9202205720280");
  assert.equal(unknown.citizenship, "Unknown");
});

test("accepts ids with surrounding whitespace", () => {
  const result = parseSouthAfricanId("  9202205720082  ");
  assert.equal(result.isValid, true);
  assert.equal(result.idNumber, "9202205720082");
});

test("handles non-string input without throwing", () => {
  assert.doesNotThrow(() => parseSouthAfricanId(undefined));
  assert.doesNotThrow(() => parseSouthAfricanId(null));
});
