"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = capitalize;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}