//const events = require('events');
const fn = require('./lib.js');

class controller {
  constructor(obj) {
    this.views = []
    this.obj = obj
    this.type = obj.constructor.name
    if (this.obj) {
      this.addController()
    }
  }
  //called from within model
  addController() {
    this.obj.addController(this)
  }
  eventUpdate(event, origin, data) {
    this.view_push(event)
    this[event](data, this.obj.obj)
  }

  //called from within view
  view_push(event) {
    for (let i of this.views) {
      i.propsUpdate(event)
    }
  }
  addView(view) {
    this.views.push(view)
    view.propsUpdate()
  }
  removeView(view) {
    this.views.splice(this.views.indexOf(view), 1)
  }
  update(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model update (default controller)")
        break;
      case "collection":
        console.log("collection update (default controller)")
        break;
    }
  }
  add(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model add (default controller)")
        break;
      case "collection":
        console.log("collection add (default controller)")
        break;
    }
  }
  remove(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model remove (default controller)")
        break;
      case "collection":
        console.log("collection remove (default controller)")
        break;
    }
  }
  destroy(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model destroy (Model) (default controller)")
        break;
      case "collection":
        console.log("collection destroy (Model) (default controller)")
        break;
    }
  }
  detach(data) {
    switch (this.type) {
      case "model":
        console.log("model detach (Model) (default controller)")
        break;
      case "collection":
        console.log("collection detach (Model) (default controller)")
        break;
    }
  }
  destroyCollection(data, changedata) {
    console.log("collection destroy (Collection) (default controller)")
  }
  load(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model load (default controller)")
        break;
      case "collection":
        console.log("collection load (default controller)")
        break;
    }
  }
  save(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model save (default controller)")
        break;
      case "collection":
        console.log("collection save (default controller)")
        break;
    }
  }
}
module.exports = controller
