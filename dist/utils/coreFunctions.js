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
