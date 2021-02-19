// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../.nvm/versions/node/v14.4.0/lib/node_modules/parcel-bundler/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    var errorListener; // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.

    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}
},{}],"../lib.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var idVar = -1;
module.exports = {
  clone: function clone(obj) {
    obj = JSON.parse(JSON.stringify(obj));
    return obj;
  },
  id: function id() {
    idVar++;
    return idVar;
  },
  objectTypeValidate: function objectTypeValidate(obj, type) {
    switch (type) {
      case "array":
        if (Array.isArray(obj)) {} else {
          if (!obj) {
            obj = [];
          } else {
            obj = [obj];
          }
        }

        break;

      case "object":
        if (_typeof(obj) === 'object' && obj !== null) {} else {
          obj = {};
        }

        break;
    }

    return obj;
  },
  remove: function remove(obj1, obj2) {
    var obj = {
      updated: {},
      removed: {},
      added: {}
    };

    var compareRecursive = function compareRecursive(obj1, obj2, removed) {
      for (var key in obj2) {
        if (obj2[key] === false) {
          removed[key] = obj1[key];
          delete obj1[key];
        } else if (_typeof(obj2[key]) === 'object' && Object.keys(obj2[key]).length > 0) {
          removed[key] = {};
          compareRecursive(obj1[key], obj2[key], obj.removed[key]);
        }
      }
    };

    compareRecursive(obj1, obj2, obj.removed);
    return obj;
  },
  compare: function compare(obj1, obj2) {
    var obj = {
      updated: {},
      removed: {},
      added: {}
    };

    var compareRecursive = function compareRecursive(obj1, obj2, updated, removed, added) {
      var _loop = function _loop(key) {
        if (Array.isArray(obj1[key])) {
          var diff = obj2[key].filter(function (x) {
            return !obj1[key].includes(x);
          });
          var invDiff = obj1[key].filter(function (x) {
            return !obj2[key].includes(x);
          });

          if (diff.length > 0 || invDiff > 0) {
            added[key] = diff;
            removed[key] = invDiff;
            updated[key] = obj2[key];
          }
        } else {
          if (obj2[key] === obj1[key]) {} else if (_typeof(obj1[key]) === 'object' && obj1[key] !== null && Object.keys(obj1[key]).length > 0) {
            if (!updated[key]) {
              updated[key] = {};
            }

            if (!removed[key]) {
              removed[key] = {};
            }

            if (!added[key]) {
              added[key] = {};
            }

            compareRecursive(obj1[key], obj2[key], updated[key], removed[key], added[key]);
          } else if (obj1[key]) {
            updated[key] = obj2[key];
            removed[key] = obj1[key];
          } else {
            updated[key] = obj2[key];
            added[key] = obj2[key];
          }
        }
      };

      for (var key in obj2) {
        _loop(key);
      }

      removed = obj1;
    };

    compareRecursive(obj1, obj2, obj.updated, obj.removed, obj.added);
    return obj;
  },
  prune: function prune(obj, schema) {
    var output = {};

    var compareRecursive = function compareRecursive(obj, schema, output) {
      for (var key in schema) {
        var option = schema[key];
        var defaultData = "";

        if (schema[key].type || schema[key].default) {
          option = schema[key].type;

          if (schema[key].default) {
            defaultData = schema[key].default;
          }
        }

        if (obj && _typeof(option) === 'object' && obj[key] !== null && Object.keys(obj).length > 0) {
          output[key] = {};
          compareRecursive(obj[key], schema[key], output[key]);
        }

        if (defaultData && !obj[key]) {
          output[key] = defaultData;
        } else if (obj) {
          switch (option) {
            case String:
              //console.log(obj[key]);
              if (typeof obj[key] === "string") {
                output[key] = obj[key];
              }

              break;

            case Number:
              if (typeof obj[key] === "number") {
                output[key] = obj[key];
              }

              break;

            case Boolean:
              if (typeof obj[key] === "boolean") {
                output[key] = obj[key];
              }

              break;

            case Array:
              if (Array.isArray(obj[key])) {
                output[key] = obj[key];
              }

              break;
          }
        }
      }
    };

    compareRecursive(obj.obj, schema, output);
    obj.obj = output;
    return obj;
  },
  query: function query(obj, _query) {
    var result = true;

    var compareRecursive = function compareRecursive(o, q) {
      for (var key in q) {
        if (_typeof(q[key]) === 'object' && Object.keys(q[key]).length > 0) {
          compareRecursive(o[key], q[key]);
        } else if (o[key] !== q[key]) {
          result = false;
        }
      }
    };

    compareRecursive(obj.obj, _query);
    return result;
  }
};
},{}],"../bipartite.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var events = require('events');

var fn = require('./lib.js');

var schema = /*#__PURE__*/function () {
  function schema(obj) {
    _classCallCheck(this, schema);

    this.obj = obj;
  }

  _createClass(schema, [{
    key: "prune",
    value: function prune(pruneobj) {
      return fn.prune(pruneobj, this.obj);
    }
  }]);

  return schema;
}();

var model = /*#__PURE__*/function () {
  function model(obj) {
    _classCallCheck(this, model);

    this.obj = fn.clone(obj);
    this.event = new events.EventEmitter();
    this.change = {};

    if (obj._id) {
      this.id = obj._id;
    } else {
      this.id = fn.id();
    }
  }

  _createClass(model, [{
    key: "update",
    value: function update(addObj) {
      if (addObj) {
        this.previousObj = fn.clone(this.obj);
        this.obj = addObj;

        if (this.schema) {
          this.schema.prune(this);
        }

        this.change = fn.compare(this.previousObj, this.obj);
        this.event.emit('update', this); //console.log("update");
      }
    }
  }, {
    key: "remove",
    value: function remove(removeObj) {
      // to remove key from object
      if (removeObj) {
        this.previousObj = fn.clone(this.obj);

        if (this.schema) {
          this.schema.prune(this);
        }

        this.change = fn.compare(this.previousObj, removeObj);
        this.event.emit('remove', this);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      // destory model
      this.event.emit('destroy');
    }
  }, {
    key: "detach",
    value: function detach() {
      console.log("detching from model");
    }
  }, {
    key: "save",
    value: function save() {
      // save model (if not autosaving)
      this.event.emit('save');
    }
  }, {
    key: "load",
    value: function load() {
      // load from remote server (if not autloading)
      this.event.emit('load');
    }
  }]);

  return model;
}();

var collection = /*#__PURE__*/function () {
  function collection(obj, data) {
    _classCallCheck(this, collection);

    this.obj = fn.objectTypeValidate(obj, "array");
    this.event = new events.EventEmitter();

    if (data) {
      if (data.url) {
        this.url = data.url;
      }

      if (data.schema) {
        this.schema = data.schema;
      }
    }

    this.id = fn.id();
  }

  _createClass(collection, [{
    key: "add",
    value: function add(addObj) {
      var self = this; // add loop to cover array of models

      if (this.schema) {
        addObj = this.schema.prune(addObj);
        addObj.schema = this.schema;
      }

      function updateEvent(data) {
        self.event.emit('update', data);
      }

      function removeEvent(data) {
        self.event.emit('remove', data);
      }

      function destroyEvent(data) {
        self.event.emit('destroy', data);
      }

      function loadEvent(data) {
        self.event.emit('load', data);
      }

      function saveEvent(data) {
        self.event.emit('save', data);
      }

      function detachEvent(collection) {
        if (collection === self) {
          addObj.event.removeListener('update', updateEvent);
          addObj.event.removeListener('remove', removeEvent);
          addObj.event.removeListener('destroy', destroyEvent);
          addObj.event.removeListener('load', loadEvent);
          addObj.event.removeListener('save', saveEvent);
          addObj.event.removeListener('detach', detachEvent);
        }
      }

      ;
      addObj.event.addListener('update', updateEvent);
      addObj.event.addListener('remove', removeEvent);
      addObj.event.addListener('destroy', destroyEvent);
      addObj.event.addListener('load', loadEvent);
      addObj.event.addListener('save', saveEvent);
      addObj.event.addListener('detach', detachEvent);
      this.obj = this.obj.concat(fn.objectTypeValidate(addObj, "array"));
      this.event.emit('add', this.obj, addObj);
    }
  }, {
    key: "update",
    value: function update(updateObj, query) {
      // to add the same update to all models - bulk
      var _iterator = _createForOfIteratorHelper(this.obj),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;

          if (!query || fn.query(i, query)) {
            i.update(updateObj);
          }
        } //this.event.emit('update');

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "remove",
    value: function remove(removeObj, query) {
      // to remove the same update to all models - bulk
      var _iterator2 = _createForOfIteratorHelper(this.obj),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var i = _step2.value;

          if (!query || fn.query(i, query)) {
            i.remove(removeObj);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.event.emit('remove');
    }
  }, {
    key: "detach",
    value: function detach(model) {
      // detach all listeners from collection for model
      if (model) {
        model.event.emit('detach', this);
        this.event.emit("detach", model);
      } else {
        console.log("no model to detach from collection");
      }
    }
  }, {
    key: "findAndDetach",
    value: function findAndDetach(query) {
      // run a query to then detach each matching model
      var _iterator3 = _createForOfIteratorHelper(this.obj),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var i = _step3.value;

          if (Object.keys(query).length > 0 && fn.query(i, query)) {
            this.detach(i);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "destroyCollection",
    value: function destroyCollection() {
      // destroy collection
      this.event.emit('destroyCollection');
    }
  }, {
    key: "save",
    value: function save() {
      // save collection (if not autosaving)
      this.event.emit('save');
    }
  }, {
    key: "load",
    value: function load() {
      // load from remote server (if not autloading)
      this.event.emit('load');
    }
  }, {
    key: "models",
    value: function models() {
      return this.obj.map(function (x) {
        return x.obj;
      });
    }
  }]);

  return collection;
}();

var controller = /*#__PURE__*/function () {
  function controller(obj) {
    _classCallCheck(this, controller);

    var self = this;
    this.obj = obj;
    this.type = obj.constructor.name;
    obj.event.addListener('update', function (data) {
      self.update(data, self.obj.obj);
    });
    obj.event.addListener('add', function (data) {
      self.add(data, self.obj.obj);
    });
    obj.event.addListener('remove', function (data) {
      self.remove(data, self.obj.obj);
    });
    obj.event.addListener('destroy', function () {
      self.destroy();
    });
    obj.event.addListener('detach', function (data) {
      self.detach(data);
    });
    /*obj.event.addListener('detached', function() {
      self.detached()
    })*/

    obj.event.addListener('destroyCollection', function () {
      self.destroyCollection();
    });
    obj.event.addListener('load', function () {
      self.load();
    });
    obj.event.addListener('save', function () {
      self.save();
    });
  }

  _createClass(controller, [{
    key: "collection",
    value: function collection() {
      return this.obj.obj;
    }
  }, {
    key: "update",
    value: function update(data, changedata, obj) {
      switch (this.type) {
        case "model":
          console.log("model update (default controller)");
          break;

        case "collection":
          console.log("collection update (default controller)");
          break;
      }
    }
  }, {
    key: "add",
    value: function add(data, changedata, obj) {
      switch (this.type) {
        case "model":
          console.log("model add (default controller)");
          break;

        case "collection":
          console.log("collection add (default controller)");
          break;
      }
    }
  }, {
    key: "remove",
    value: function remove(data, changedata, obj) {
      switch (this.type) {
        case "model":
          console.log("model remove (default controller)");
          break;

        case "collection":
          console.log("collection remove (default controller)");
          break;
      }
    }
  }, {
    key: "destroy",
    value: function destroy(data, changedata) {
      switch (this.type) {
        case "model":
          console.log("model destroy (Model) (default controller)");
          break;

        case "collection":
          console.log("collection destroy (Model) (default controller)");
          break;
      }
    }
  }, {
    key: "detach",
    value: function detach(data) {
      switch (this.type) {
        case "model":
          console.log("model detach (Model) (default controller)");
          break;

        case "collection":
          console.log("collection detach (Model) (default controller)");
          break;
      }
    }
  }, {
    key: "destroyCollection",
    value: function destroyCollection(data, changedata) {
      console.log("collection destroy (Collection) (default controller)");
    }
  }, {
    key: "load",
    value: function load(data, changedata) {
      switch (this.type) {
        case "model":
          console.log("model load (default controller)");
          break;

        case "collection":
          console.log("collection load (default controller)");
          break;
      }
    }
  }, {
    key: "save",
    value: function save(data, changedata) {
      switch (this.type) {
        case "model":
          console.log("model save (default controller)");
          break;

        case "collection":
          console.log("collection save (default controller)");
          break;
      }
    }
  }]);

  return controller;
}();

module.exports = {
  schema: schema,
  model: model,
  collection: collection,
  controller: controller
};
},{"events":"../../../.nvm/versions/node/v14.4.0/lib/node_modules/parcel-bundler/node_modules/events/events.js","./lib.js":"../lib.js"}],"demo.js":[function(require,module,exports) {
var mvc = require("../bipartite.js");

var schemaObj = {
  fruit: String,
  name: String,
  place: {
    type: String,
    default: "this place"
  },
  defaulPlace: {
    type: String,
    default: "default place"
  },
  list: Array,
  truthy: Boolean,
  untruthy: Boolean,
  recursive: {
    recursivething: String,
    recursivestr: String,
    recursive: {
      recursivething: String,
      recursivestr: String
    }
  }
};
var data = {
  url: "www.google.com",
  schema: new mvc.schema(schemaObj)
};
var obj2 = {
  name: "ted",
  place: "over here",
  wrongplace: "should not be here",
  list: ["jjhjh", "trtrtr"],
  truthy: false,
  untruthy: "true",
  recursive: {
    recursivething: "blah",
    recursivestr: 6,
    recursive: {
      recursivething: "blah",
      recursivestr: "dsfd"
    }
  }
};
var obj3 = {
  name: "billy bob jimbo",
  place: "over and away",
  wrongplace: "should not be here",
  list: ["jjhjssssh", "trtrtr"],
  truthy: true,
  untruthy: "kss",
  recursive: {
    recursivething: "hghghghg",
    recursivestr: 8,
    recursive: {
      recursivething: "sdd",
      recursivestr: "aaaa"
    }
  }
};
var modelObj2 = new mvc.model(obj2);
var modelObj3 = new mvc.model(obj3);
var modelController = new mvc.controller(modelObj2);

modelController.update = function (model) {
  switch (this.type) {
    case "model":
      console.log("model update (set in controller)");
      break;

    case "collection":
      console.log("collection update (set in controller)");
      break;
  }
};

modelController.add = function (model) {
  switch (this.type) {
    case "model":
      console.log("model added (set in controller)");
      break;

    case "collection":
      console.log("collection added (set in controller)");
      break;
  }
};

modelController.remove = function (model) {
  switch (this.type) {
    case "model":
      console.log("model removed (set in controller)");
      break;

    case "collection":
      console.log("collection removed (set in controller)");
      break;
  }
};

var collectionObj = new mvc.collection(null, data);
var controller2 = new mvc.controller(collectionObj);

controller2.add = function (model) {
  switch (this.type) {
    case "model":
      console.log("model add (set in controller)");
      break;

    case "collection":
      console.log("collection add (set in controller)"); //console.log(model)

      break;
  }
};

controller2.update = function (model) {
  switch (this.type) {
    case "model":
      console.log("model update (set in controller)"); //console.log(model.obj)

      break;

    case "collection":
      console.log("collection update (set in controller)"); //console.log(model.obj)
      //console.log(model.obj);
      //console.log(this.obj)

      break;
  }
};

controller2.remove = function (model) {
  switch (this.type) {
    case "model":
      console.log("model remove (set in controller)");
      break;

    case "collection":
      console.log("collection remove (set in controller)");
      break;
  }
};

controller2.detach = function (model) {
  switch (this.type) {
    case "model":
      console.log("model detach (set in controller)");
      break;

    case "collection":
      console.log("Model: " + model.id + " removed from collection: " + this.obj.id);
      break;
  }
};

collectionObj.add(modelObj2);
collectionObj.add(modelObj3);
var updateObj = {
  fruit: "orange",
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 2,
    recursive: {
      recursivestr: "dsfffd"
    }
  }
};
var removeObj = {
  fruit: false,
  recursive: {
    recursivething: false,
    recursive: {
      recursivestr: false
    }
  }
};
var query = {
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 3
  }
};
var detachQuery = {
  fruit: "orange"
};
collectionObj.update(updateObj);
collectionObj.update(updateObj, query);
collectionObj.remove(removeObj);
collectionObj.detach();
collectionObj.findAndDetach(detachQuery);
collectionObj.update(updateObj);
collectionObj.destroyCollection();
collectionObj.load();
collectionObj.save();
modelObj2.update({
  list: ["jjhjh", "jjddddhjh", "trtjrtr", "gfgfgfffgf"],
  fruit: "apple",
  name: "jim",
  more: {
    thing: "no",
    otherthing: "kaaakj",
    newthing: "jsjsj",
    list: ["more jjhjh", "more trtrtr"]
  }
});
modelObj2.update({
  fruit: "orange",
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 2,
    recursive: {
      recursivestr: "dsfffd"
    }
  }
});
modelObj2.remove();
modelObj2.destroy();
modelObj2.load();
modelObj2.save(); //console.log(collectionObj.models())
},{"../bipartite.js":"../bipartite.js"}],"../../../.nvm/versions/node/v14.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34451" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v14.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","demo.js"], null)
//# sourceMappingURL=/demo.d3b53871.js.map