"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMachine = _getMachine;
exports.createMachine = createMachine;

var _kebabToCamel = _interopRequireDefault(require("./kebabToCamel"));

var _capitalize = _interopRequireDefault(require("./capitalize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var machines = {};
var proxyHandler = {
  get: function get(obj, prop) {
    if (typeof prop === 'string' && prop.indexOf('is') === 0 && !(prop in obj)) {
      var state = prop.replace('is', '');
      return obj.isState.bind(obj, state.charAt(0).toLowerCase() + state.slice(1));
    }

    return obj[prop];
  }
};

function _getMachine(name) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var machine = machines[name];

  if (id) {
    var idName = "".concat(name, ".").concat(id);
    machine = _getMachine(idName);

    if (!machine) {
      machine = createMachine(name, null, id);
    }
  }

  return machine;
}

var Machine = /*#__PURE__*/function () {
  function Machine(name, configuration) {
    var _this = this;

    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var initialData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var sync = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Machine);

    _defineProperty(this, "input", function (action, data) {
      var current = _this.state.current;

      if (!_this.transitionAllowed(current, action)) {
        return;
      }

      var transition = _this.transitions[action];

      _this.setState(transition.to, data);
    });

    this.name = name;
    this.id = id;
    this.sync = sync;
    this.subscribers = [];
    this.configuration = configuration;
    this.transitions = this.configuration.transitions;
    this.state = _objectSpread(_objectSpread({}, this.configuration.state), initialData);
    this.handlers = this.configuration.handlers;
    Object.entries(this.handlers).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          func = _ref2[1];

      _this[name] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return func.apply(_this, args);
      };
    });
    Object.entries(this.transitions).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
          state = _ref4[0];

      _this[state] = function () {
        for (var _len2 = arguments.length, data = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          data[_key2] = arguments[_key2];
        }

        _this.input(state, data);
      };
    });
    return new Proxy(this, proxyHandler);
  }

  _createClass(Machine, [{
    key: "getMachine",
    value: function getMachine(machine) {
      return _getMachine(machine);
    }
  }, {
    key: "setSync",
    value: function setSync(sync) {
      this.sync = sync;
    }
  }, {
    key: "getParent",
    value: function getParent() {
      var _this$name$split = this.name.split('.'),
          _this$name$split2 = _slicedToArray(_this$name$split, 1),
          parent = _this$name$split2[0];

      if (parent !== this.name) {
        return parent;
      }

      return null;
    }
  }, {
    key: "getParentMachine",
    value: function getParentMachine() {
      var parent = this.getParent();

      if (parent) {
        return _getMachine(parent);
      }

      return null;
    }
  }, {
    key: "getParentAttr",
    value: function getParentAttr() {
      var _this$name$split3 = this.name.split('.'),
          _this$name$split4 = _slicedToArray(_this$name$split3, 1),
          parent = _this$name$split4[0];

      if (parent !== this.name) {
        return parent;
      }

      return this.name;
    }
  }, {
    key: "getChildAttr",
    value: function getChildAttr() {
      var _this$name$split5 = this.name.split('.'),
          _this$name$split6 = _slicedToArray(_this$name$split5, 2),
          parent = _this$name$split6[0],
          child = _this$name$split6[1];

      if (parent !== this.name) {
        return child;
      }

      return this.name;
    }
  }, {
    key: "getChildMachines",
    value: function getChildMachines() {
      var _this2 = this;

      var parent = this.getParent();

      if (!parent) {
        var childMachines = Object.keys(machines).filter(function (name) {
          return name.indexOf("".concat(_this2.name, ".")) > -1;
        });
        return childMachines;
      }

      return [];
    }
  }, {
    key: "isParent",
    value: function isParent() {
      var childMachines = this.getChildMachines();
      return childMachines.length > 0;
    }
  }, {
    key: "isChild",
    value: function isChild() {
      return this.getParent() !== null;
    }
  }, {
    key: "subscribe",
    value: function subscribe(cb) {
      var _this3 = this;

      if (!this.subscribers.includes(cb)) {
        this.subscribers.push(cb);
      }

      return {
        unsubscribe: function unsubscribe() {
          _this3.subscribers = _this3.subscribers.filter(function (subscribedCb) {
            return subscribedCb !== cb;
          });
        }
      };
    }
  }, {
    key: "isState",
    value: function isState(state) {
      return state === this.state.current || state === (0, _kebabToCamel.default)(this.state.current);
    }
  }, {
    key: "transitionAllowed",
    value: function transitionAllowed(currentState, action) {
      var transition = this.transitions[action];
      return transition && transition.from === currentState;
    }
  }, {
    key: "setData",
    value: function setData(data) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.setState(this.state.current, [data], silent);
    }
  }, {
    key: "setState",
    value: function setState(state) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var newData = data.length && _typeof(data[0]) === 'object' ? data[0] : {};
      var prevState = "".concat(this.state.current);

      var newState = _objectSpread({}, newData);

      if (state !== prevState) {
        newState.current = state;
      }

      this.state = _objectSpread(_objectSpread({}, this.state), newState);

      if (!silent) {
        this.emit(newState);

        if (prevState !== this.state.current) {
          var handler = "on".concat((0, _capitalize.default)((0, _kebabToCamel.default)(state)));

          if (handler in this) {
            this[handler].apply(this, _toConsumableArray(data));
          }
        }
      }
    }
  }, {
    key: "emit",
    value: function emit(newData) {
      var _this4 = this;

      this.subscribers.forEach(function (cb) {
        return cb.call(null, newData, _this4.state);
      });

      if (this.sync) {
        var parentMachine = this.getParentMachine();

        if (parentMachine) {
          var childAttr = this.getChildAttr();
          var parentAttr = this.getParentAttr();

          var data = _objectSpread({}, this.state[childAttr]);

          var transition = "update".concat((0, _capitalize.default)(childAttr));

          var items = _toConsumableArray(parentMachine.state[parentAttr]);

          var index = items.findIndex(function (item) {
            return item.id === data.id;
          });

          if (index > -1) {
            items[index] = _objectSpread(_objectSpread({}, items[index]), data);
            parentMachine[transition](_defineProperty({}, parentAttr, items));
          }
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      machines[this.name] = null;
      delete machines[this.name];
    }
  }]);

  return Machine;
}();

function createMachine(name) {
  var configuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!(name in machines)) {
    machines[name] = new Machine(name, configuration, null);
  }

  if (id) {
    var idName = "".concat(name, ".").concat(id);

    var _name$split = name.split('.'),
        _name$split2 = _slicedToArray(_name$split, 2),
        parent = _name$split2[0],
        child = _name$split2[1];

    var sync = false;
    var data = null;

    if (idName in machines) {
      return machines[idName];
    }

    if (parent !== name) {
      var parentMachine = _getMachine(parent);

      if (parentMachine && parent in parentMachine.state) {
        var items = parentMachine.state[parent];
        var item = items.find(function (item) {
          return item.id === id;
        });

        if (item) {
          data = _defineProperty({}, child, item);
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