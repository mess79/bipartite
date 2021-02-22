const fn = require('./lib.js');

class schema {
  constructor(obj) {
    this.obj = obj
  }
  prune(pruneobj) {
    return fn.prune(pruneobj, this.obj)
  }
}

module.exports = schema
