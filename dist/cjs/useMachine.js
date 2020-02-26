"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMachine;

var _react = require("react");

var _machine = require("./machine");

function useMachine(name, id = null, initialData = null) {
  const machine = (0, _machine.getMachine)(name, id, initialData);

  if (!machine) {
    throw new Error('Machine not found');
  }

  const [state, setState] = (0, _react.useState)(machine.state);
  (0, _react.useEffect)(() => {
    const [parent] = name.split('.');
    const subscription = machine.subscribe(setState);

    if (parent !== name) {
      const parentMachine = (0, _machine.getMachine)(parent);
    }

    return () => {
      subscription.unsubscribe();
      machine.destroy();
    };
  }, []);
  return [state, machine];
}