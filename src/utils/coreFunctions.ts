export function transformId(obj: { _id: any; [key: string]: any }) {
  const { _id, ...rest } = obj;
  return { ...rest, id: _id.toString() };
}

interface DateObject {
  date: Date | string | null;
}

export function formatDate(date: DateObject["date"]): string {
  if (!date) {
    return "Present";
  }
  return new Date(date).toISOString().split("T")[0];
}

export function generatePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + specialChars;

  const getRandomChar = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Ensure at least one character from each category
  let password = [
    getRandomChar(uppercase),
    getRandomChar(lowercase),
    getRandomChar(numbers),
    getRandomChar(specialChars),
  ];

  // Fill the remaining characters randomly within the allowed range (8-12)
  const length = Math.floor(Math.random() * 5) + 8; // Random length between 8 and 12
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(allChars));
  }

  // Shuffle the password to avoid predictable patterns
  password = password.sort(() => Math.random() - 0.5);

  return password.join("");
}
