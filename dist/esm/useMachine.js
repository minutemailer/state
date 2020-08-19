function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { useEffect, useState, useMemo } from 'react';
import { getMachine } from './machine';
import filterObject from './filterObject';
export default function useMachine(name, id = null, reducer = false, persistent = true) {
  const machine = useMemo(() => getMachine(name, id), [name, id]);

  if (!machine) {
    throw new Error('Machine not found');
  }

  if (reducer === false) {
    return machine;
  }

  const [state, setState] = useState(filterObject(machine.state, reducer));
  useEffect(() => {
    const subscription = machine.subscribe(newState => {
      const newData = filterObject(newState, reducer);

      if (Object.keys(newData).length) {
        setState(oldState => _objectSpread(_objectSpread({}, oldState), newData));
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