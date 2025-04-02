"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformId = transformId;
exports.formatDate = formatDate;
exports.generatePassword = generatePassword;
function transformId(obj) {
    const { _id } = obj, rest = __rest(obj, ["_id"]);
    return Object.assign(Object.assign({}, rest), { id: _id.toString() });
}
function formatDate(date) {
    if (!date) {
        return "Present";
    }
    return new Date(date).toISOString().split("T")[0];
}
function generatePassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    const allChars = uppercase + lowercase + numbers + specialChars;
    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
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
