"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMachine;

var _react = require("react");

var _machine = require("./machine");

function useMachine(name) {
  const machine = (0, _machine.getMachine)(name);

  if (!machine) {
    throw new Error('Machine not found');
  }

  const [state, setState] = (0, _react.useState)(machine.state);
  (0, _react.useEffect)(() => {
    const subscription = machine.subscribe(setState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return [state, machine];
}