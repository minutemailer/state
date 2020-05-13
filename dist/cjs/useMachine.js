"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMachine;

var _react = require("react");

var _machine = require("./machine");

var _filterObject = _interopRequireDefault(require("./filterObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useMachine(name, id = null, reducer = false, persistent = true) {
  const machine = (0, _react.useMemo)(() => (0, _machine.getMachine)(name, id), [name, id]);

  if (!machine) {
    throw new Error('Machine not found');
  }

  if (reducer === false) {
    return machine;
  }

  const [state, setState] = (0, _react.useState)((0, _filterObject.default)(machine.state, reducer));
  (0, _react.useEffect)(() => {
    const subscription = machine.subscribe(newState => {
      const newData = (0, _filterObject.default)(newState, reducer);

      if (Object.keys(newData).length) {
        setState(oldState => _objectSpread({}, oldState, {}, newData));
      }
    });
    return () => {
      subscription.unsubscribe();

      if (!persistent) {
        machine.destroy();
      }
    };
  }, []);
  return [state, machine];
}