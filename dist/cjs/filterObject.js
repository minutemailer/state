"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterObject;

function filterObject(data, keys) {
  return Object.fromEntries(Object.entries(data).filter(([key]) => keys.includes(key)));
}