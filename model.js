const events = require('events');
const fn = require('./lib.js');

class model {
  constructor(obj) {
    this.obj = fn.clone(obj)
    this.event = new events.EventEmitter()
    this.change = {}
    if (obj._id) {
      this.id = obj._id
    } else {
      this.id = fn.id();
    }
  }
  update(addObj) {
    if (addObj) {
      this.previousObj = fn.clone(this.obj)
      this.obj = addObj
      if (this.schema) {
        this.schema.prune(this)
      }
      this.change = fn.compare(this.previousObj, this.obj)
      this.event.emit('update', this);
      //console.log("update");
    }
  }
  remove(removeObj) {
    // to remove key from object
    if (removeObj) {
      this.previousObj = fn.clone(this.obj)
      if (this.schema) {
        this.schema.prune(this)
      }
      this.change = fn.compare(this.previousObj, removeObj)
      this.event.emit('remove', this);
    }
  }
  destroy() {
    // destory model
    this.event.emit('destroy');
  }
  detach() {
    console.log("detching from model")
  }
  save() {
    // save model (if not autosaving)
    this.event.emit('save');
  }
  load() {
    // load from remote server (if not autloading)
    this.event.emit('load');
  }
}

module.exports = model
