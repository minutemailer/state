function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import kebabToCamel from './kebabToCamel';
import capitalize from './capitalize';
const machines = {};
const proxyHandler = {
  get: (obj, prop) => {
    if (prop.indexOf('is') === 0 && !(prop in obj)) {
      const state = prop.replace('is', '').toLowerCase();
      return obj.isState.bind(obj, state);
    }

    return obj[prop];
  }
};
export function getMachine(name, id = null, initialData = null) {
  if (!(name in machines)) {
    return false;
  }

  let machine = machines[name];

  if (id) {
    machine = createMachine(name, null, id, initialData);
  }

  return machine;
}

class Machine {
  constructor(name, configuration, id = null, initialData = {}, sync = false) {
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

    this.name = name;
    this.id = id;
    this.sync = sync;
    this.subscribers = [];
    this.configuration = configuration;
    this.transitions = this.configuration.transitions;
    this.state = _objectSpread({}, this.configuration.state, {}, initialData);
    this.handlers = this.configuration.handlers;
    Object.entries(this.handlers).forEach(([name, func]) => {
      this[name] = (...args) => func.apply(this, args);
    });
    Object.entries(this.transitions).forEach(([state]) => {
      this[state] = (...data) => {
        this.input(state, data);
      };
    });
    return new Proxy(this, proxyHandler);
  }

  getMachine(machine) {
    return getMachine(machine);
  }

  setSync(sync) {
    this.sync = sync;
  }

  getParent() {
    const [parent] = this.name.split('.');

    if (parent !== this.name) {
      return parent;
    }

    return null;
  }

  getParentMachine() {
    const parent = this.getParent();

    if (parent) {
      return getMachine(parent);
    }

    return null;
  }

  getParentAttr() {
    const [parent] = this.name.split('.');

    if (parent !== this.name) {
      return parent;
    }

    return this.name;
  }

  getChildAttr() {
    const [parent, child] = this.name.split('.');

    if (parent !== this.name) {
      return child;
    }

    return this.name;
  }

  getChildMachines() {
    const parent = this.getParent();

    if (!parent) {
      const childMachines = Object.keys(machines).filter(name => name.indexOf(`${this.name}.`) > -1);
      return childMachines;
    }

    return [];
  }

  isParent() {
    const childMachines = this.getChildMachines();
    return childMachines.length > 0;
  }

  isChild() {
    return this.getParent() !== null;
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

  setState(state, data = [], silent = false) {
    const newData = data.length && typeof data[0] === 'object' ? data[0] : {};
    const prevState = `${this.state.current}`;
    this.state = _objectSpread({}, this.state, {
      current: state
    }, newData);

    if (!silent) {
      this.emit();

      if (prevState !== this.state.current) {
        const handler = `on${capitalize(kebabToCamel(state))}`;

        if (handler in this) {
          this[handler](...data);
        }
      }
    }
  }

  setData(data, silent = false) {
    this.setState(this.state.current, data, silent);
  }

  emit() {
    this.subscribers.forEach(cb => cb.call(null, this.state));

    if (this.sync) {
      const parentMachine = this.getParentMachine();

      if (parentMachine) {
        const childAttr = this.getChildAttr();
        const parentAttr = this.getParentAttr();

        const data = _objectSpread({}, this.state[childAttr]);

        const transition = `update${capitalize(childAttr)}`;
        const items = [...parentMachine.state[parentAttr]];
        const index = items.findIndex(item => item.id === data.id);

        if (index > -1) {
          items[index] = _objectSpread({}, items[index], {}, data);
          parentMachine[transition]({
            [parentAttr]: items
          });
        }
      }
    }
  }

  destroy() {
    machines[this.name] = null;
    delete machines[this.name];
  }

}

export function createMachine(name, configuration = {}, id = null, initialData = null) {
  if (!(name in machines)) {
    machines[name] = new Machine(name, configuration, null, initialData);
  }

  if (id) {
    const idName = `${name}.${id}`;
    const [parent, child] = name.split('.');
    let sync = false;
    let data = initialData;

    if (idName in machines) {
      return machines[idName];
    }

    if (parent !== name) {
      const parentMachine = getMachine(parent);

      if (parentMachine && parent in parentMachine.state) {
        const items = parentMachine.state[parent];
        const item = items.find(item => item.id === id);

        if (item) {
          if (!initialData) {
            data = {
              [child]: item
            };
          }

          sync = true;
          parentMachine.setSync(true);
        }
      }
    }

    machines[idName] = new Machine(idName, _objectSpread({}, machines[name].configuration), id, data, sync);
    return machines[idName];
  }

  return machines[name];
}