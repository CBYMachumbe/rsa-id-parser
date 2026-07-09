# rsa-id-parser

Parse and validate South African ID numbers — date of birth, age, gender, citizenship, and checksum — with zero dependencies. Works with `import`, `require()`, and TypeScript out of the box.

## Install

```bash
npm install rsa-id-parser
```

## Usage

### ESM

```js
import parseSouthAfricanId from "rsa-id-parser";

const result = parseSouthAfricanId("9202205720082");
```

### CommonJS

```js
const parseSouthAfricanId = require("rsa-id-parser");

const result = parseSouthAfricanId("9202205720082");
```

### TypeScript

Type declarations are bundled — no `@types` package needed.

```ts
import parseSouthAfricanId, { ParsedSouthAfricanId } from "rsa-id-parser";

const result: ParsedSouthAfricanId = parseSouthAfricanId("9202205720082");
```

## How it works

A South African ID number is 13 digits, structured as `YYMMDDSSSSCAZ`:

| Segment    | Digits | Meaning                                                          |
| ---------- | ------ | ----------------------------------------------------------------- |
| `YYMMDD`   | 1–6    | Date of birth (year is inferred as 1900s or 2000s, see below)    |
| `SSSS`     | 7–10   | Gender sequence: `0000`–`4999` is female, `5000`–`9999` is male  |
| `C`        | 11     | Citizenship: `0` is SA citizen, `1` is permanent resident        |
| `A`        | 12     | Historically an "8" — not used by this parser                    |
| `Z`        | 13     | Checksum digit, validated with the Luhn algorithm                |

`parseSouthAfricanId` reads each segment and returns a structured result rather than throwing — invalid input produces `isValid: false` plus a list of human-readable `errors`, so you can always inspect what went wrong.

**Century inference:** since the ID number only encodes a two-digit year, the parser compares it to the current two-digit year. If the ID's `YY` is greater than today's `YY`, it's assumed to be a 1900s birth year; otherwise it's assumed to be 2000s. This is a heuristic — it can be wrong for people born exactly 100 years ago — but it's the same assumption most SA ID tooling makes.

**Checksum:** the 13th digit is verified with the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm), the same checksum used for credit card numbers.

## API

### `parseSouthAfricanId(idNumber: string): ParsedSouthAfricanId`

| Field             | Type                                                  | Description                                                        |
| ------------------ | ------------------------------------------------------ | -------------------------------------------------------------------- |
| `isValid`          | `boolean`                                             | `true` only when the format, date, and checksum all pass            |
| `idNumber`         | `string`                                              | The trimmed input                                                   |
| `dateOfBirth`      | `Date \| null`                                        | `null` if the date couldn't be determined                            |
| `age`              | `number \| null`                                      | Age in full years as of today                                       |
| `gender`           | `"Female" \| "Male" \| null`                          | `null` if the ID number is malformed                                 |
| `citizenship`      | `"SA Citizen" \| "Permanent Resident" \| "Unknown" \| null` | `null` if the ID number is malformed                            |
| `isValidChecksum`  | `boolean`                                             | Result of the Luhn check on its own                                  |
| `errors`           | `string[]`                                            | Empty when `isValid` is `true`                                       |

### Example: valid ID

```js
parseSouthAfricanId("9202205720082");
// {
//   isValid: true,
//   idNumber: "9202205720082",
//   dateOfBirth: 1992-02-20T00:00:00.000Z,
//   age: 34,
//   gender: "Male",
//   citizenship: "SA Citizen",
//   isValidChecksum: true,
//   errors: []
// }
```

### Example: invalid ID

```js
parseSouthAfricanId("1234567890");
// {
//   isValid: false,
//   idNumber: "1234567890",
//   dateOfBirth: null,
//   age: null,
//   gender: null,
//   citizenship: null,
//   isValidChecksum: false,
//   errors: ["ID number must be exactly 13 digits"]
// }
```

## Testing

```bash
npm test
```

## License

MIT
