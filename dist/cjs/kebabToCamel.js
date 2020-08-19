"use strict";

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = kebabToCamel;

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}