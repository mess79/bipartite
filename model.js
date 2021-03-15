const fn = require('./lib.js');

class model {
  constructor(obj) {
    this.controllers = [];
    this.obj = fn.clone(obj)
    this.change = {}
    if (obj._id) {
      this.id = obj._id
    } else {
      this.id = fn.id();
    }
  }

  controller_push(event){
    for (let i of this.controllers){
      i.eventUpdate(event, this)
    }
  }
  addController(controller){
    this.controllers.push(controller)
    this.controller_push("update")
  }
  removeController(controller){
    this.controllers.splice(this.controllers.indexOf(view), 1)
  }

  update(addObj) {
    if (addObj) {
      this.previousObj = fn.clone(this.obj)
      this.obj = fn.update(this.previousObj, addObj)
      //console.log(this.obj.list)
      if (this.schema) {
        this.obj = this.schema.prune(this.obj)
      }
      this.change = fn.compare(this.previousObj, this.obj)
      this.controller_push("update")
    }
  }
  remove(removeObj) {
    // to remove key from object
    if (removeObj) {
      this.previousObj = fn.clone(this.obj)
      this.obj = fn.remove(this.previousObj, removeObj)
      if (this.schema) {
        this.obj = this.schema.prune(this.obj)
      }
      this.change = fn.compare(this.previousObj, this.obj)
      this.controller_push("remove")
    }
  }
  destroy() {
    // destory model
    this.controller_push("destroy")
  }
  detach() {
    console.log("detching from model")
  }
  save() {
    // save model (if not autosaving)
    this.controller_push("save")
  }
  load() {
    // load from remote server (if not autloading)
    this.controller_push("load")
  }
}

module.exports = model
