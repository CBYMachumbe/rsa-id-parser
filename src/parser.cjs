const isValidLuhn = (digits) => {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

const parseSouthAfricanId = (idNumber) => {
  const errors = [];
  const cleaned = String(idNumber ?? "").trim();

  if (!/^\d{13}$/.test(cleaned)) {
    return {
      isValid: false,
      idNumber: cleaned,
      dateOfBirth: null,
      age: null,
      gender: null,
      citizenship: null,
      isValidChecksum: false,
      errors: ["ID number must be exactly 13 digits"],
    };
  }

  const yy = Number(cleaned.slice(0, 2));
  const month = Number(cleaned.slice(2, 4));
  const day = Number(cleaned.slice(4, 6));
  const genderDigits = Number(cleaned.slice(6, 10));
  const citizenshipDigit = cleaned[10];

  if (month < 1 || month > 12) errors.push("Invalid month in date of birth");
  if (day < 1 || day > 31) errors.push("Invalid day in date of birth");

  // Numbers issued in the future (relative to today's YY) are assumed 1900s.
  const currentYearYY = new Date().getFullYear() % 100;
  const century = yy > currentYearYY ? 1900 : 2000;
  const fullYear = century + yy;

  let dateOfBirth = null;
  if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
    const candidate = new Date(Date.UTC(fullYear, month - 1, day));
    if (
      candidate.getUTCMonth() === month - 1 &&
      candidate.getUTCDate() === day
    ) {
      dateOfBirth = candidate;
    } else {
      errors.push("Date of birth does not exist");
    }
  }

  const gender = genderDigits < 5000 ? "Female" : "Male";
  const citizenship =
    citizenshipDigit === "0"
      ? "SA Citizen"
      : citizenshipDigit === "1"
        ? "Permanent Resident"
        : "Unknown";

  const isValidChecksum = isValidLuhn(cleaned);
  if (!isValidChecksum) errors.push("Checksum digit is invalid");

  let age = null;
  if (dateOfBirth) {
    const today = new Date();
    age = today.getUTCFullYear() - dateOfBirth.getUTCFullYear();
    const hadBirthdayThisYear =
      today.getUTCMonth() > dateOfBirth.getUTCMonth() ||
      (today.getUTCMonth() === dateOfBirth.getUTCMonth() &&
        today.getUTCDate() >= dateOfBirth.getUTCDate());
    if (!hadBirthdayThisYear) age -= 1;
  }

  return {
    isValid: errors.length === 0,
    idNumber: cleaned,
    dateOfBirth,
    age,
    gender,
    citizenship,
    isValidChecksum,
    errors,
  };
};

module.exports = parseSouthAfricanId;
module.exports.default = parseSouthAfricanId;
module.exports.parseSouthAfricanId = parseSouthAfricanId;
