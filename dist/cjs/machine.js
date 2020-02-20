"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMachine = createMachine;
exports.getMachine = getMachine;

var _kebabToCamel = _interopRequireDefault(require("./kebabToCamel"));

var _capitalize = _interopRequireDefault(require("./capitalize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const machines = {};
const proxyHandler = {
  get: (obj, prop) => {
    if (prop.indexOf('is') === 0) {
      const state = prop.replace('is', '').toLowerCase();
      return obj.isState.bind(obj, state);
    }

    return obj[prop];
  }
};

class Machine {
  constructor(configuration) {
    _defineProperty(this, "input", (action, data) => {
      const {
        current
      } = this.state;

      if (!this.transitionAllowed(current, action)) {
        return;
      }

      const transition = this.transitions[action];
      this.setState(transition.to, data);
    });

    this.subscribers = [];
    this.transitions = configuration.transitions;
    this.state = configuration.state;
    this.handlers = configuration.handlers;
    Object.entries(this.handlers).forEach(([name, func]) => {
      this[name] = (...args) => func.call(this, args);
    });
    Object.entries(this.transitions).forEach(([state]) => {
      this[state] = data => this.input(state, data);
    });
    return new Proxy(this, proxyHandler);
  }

  subscribe(cb) {
    if (!this.subscribers.includes(cb)) {
      this.subscribers.push(cb);
    }

    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter(subscribedCb => subscribedCb !== cb);
      }
    };
  }

  isState(state) {
    return state === this.state.current;
  }

  transitionAllowed(currentState, action) {
    const transition = this.transitions[action];
    return transition && transition.from === currentState;
  }

  setState(state, data) {
    this.state = _objectSpread({}, this.state, {
      current: state
    }, data);
    this.emit();
    const handler = `on${(0, _capitalize.default)((0, _kebabToCamel.default)(state))}`;

    if (handler in this) {
      this[handler](data);
    }
  }

  emit() {
    this.subscribers.forEach(cb => cb.call(null, this.state));
  }

}

function createMachine(name, configuration) {
  machines[name] = new Machine(configuration);
}

function getMachine(name) {
  return machines[name];
}