"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = kebabToCamel;

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}