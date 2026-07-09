export interface ParsedSouthAfricanId {
  /** True when the ID number is well-formed and every check (date, checksum) passes. */
  isValid: boolean;
  /** The trimmed 13-digit ID number that was parsed. */
  idNumber: string;
  /** Date of birth encoded in the ID number, or null if it couldn't be determined. */
  dateOfBirth: Date | null;
  /** Age in full years as of today, or null if the date of birth couldn't be determined. */
  age: number | null;
  /** Gender encoded in the ID number, or null if the ID number is malformed. */
  gender: "Female" | "Male" | null;
  /** Citizenship status encoded in the ID number, or null if the ID number is malformed. */
  citizenship: "SA Citizen" | "Permanent Resident" | "Unknown" | null;
  /** True when the Luhn checksum digit is valid. */
  isValidChecksum: boolean;
  /** Human-readable list of validation problems, empty when isValid is true. */
  errors: string[];
}

/**
 * Parses and validates a South African ID number, extracting date of birth,
 * age, gender, citizenship, and checksum validity.
 */
declare function parseSouthAfricanId(idNumber: string): ParsedSouthAfricanId;

export default parseSouthAfricanId;
export { parseSouthAfricanId };
