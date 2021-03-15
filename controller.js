//const events = require('events');
const fn = require('./lib.js');

class controller {
  constructor(model) {
    this.views = []
    this.model = model
    this.id = fn.id()
    this.type = model.constructor.name
    if (this.model) {
      this.addController()
    }
  }

  //called from within model
  addController() {
    this.model.addController(this)
  }
  eventUpdate(event, model) {
    this.view_push(event)
    this[event](model)
  }

  //called from within view
  view_push(event) {
    for (let i of this.views) {
      i.propsUpdate(event)
    }
  }
  addView(view) {
    this.views.push(view)
    view.propsUpdate("setup")
  }
  removeView(view) {
    this.views.splice(this.views.indexOf(view), 1)
  }

  //blank functions
  update(model) {
    console.log("model update (default controller)")
  }
  add(model) {
    console.log("model add (default controller)")
  }
  remove(model) {
    console.log("model remove (default controller)")
  }
  destroy(model) {
    console.log("model destroy (Model) (default controller)")
  }
  detach(model) {
    console.log("model detach (Model) (default controller)")
  }
  destroyCollection(model) {
    console.log("collection destroy (Collection) (default controller)")
  }
  load(model) {
    console.log("model load (default controller)")
  }
  save(model) {
    console.log("model save (default controller)")
  }
}
module.exports = controller
